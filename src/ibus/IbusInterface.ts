import autoBind from 'auto-bind';
import { EventEmitter } from 'events';
import SerialPort from 'serialport';

import { createIbusMessage, getHrDiffTime } from '../utils';
import { Callback } from '../types';
import { config } from '../config';
import loggerSystem from '../logger';

import { IncommingMessage, OutgoingMessage } from './types';
import IbusProtocol from './IbusProtocol';

const logger = loggerSystem.child({ service: 'IbusInterface' });

class IbusInterface extends EventEmitter {
  private serialPort: SerialPort;
  private parser: IbusProtocol | null;
  private queue: Buffer[] = [];
  private device: string;
  private lastActivityTime = process.hrtime();

  constructor(device: string) {
    super();

    this.device = device;
    this.parser = new IbusProtocol();
    this.serialPort = new SerialPort(this.device, {
      autoOpen: false,
      baudRate: config.iBusBaudRate,
      parity: 'even',
      stopBits: 1,
      dataBits: 8,
    });

    autoBind(this);
  }

  private watchForEmptyBus(workerFn: (callback: Callback) => void) {
    if (getHrDiffTime(this.lastActivityTime) >= 20) {
      workerFn(() => {
        setImmediate(this.watchForEmptyBus, workerFn);
      });
    } else {
      setImmediate(this.watchForEmptyBus, workerFn);
    }
  }

  private processWriteQueue(callback: Callback) {
    if (!this.queue.length) {
      callback();
      return;
    }

    const dataBuf = this.queue.pop();

    if (!dataBuf) return;

    logger.debug('Write queue length: ', this.queue.length);

    this.serialPort.write(dataBuf, (error, resp) => {
      if (error) {
        logger.error('Failed to write', error);
      } else {
        logger.info('Wrote to Device', dataBuf, resp);

        this.serialPort.drain((_error) => {
          this.lastActivityTime = process.hrtime();
          callback();
        });
      }
    });
  }

  private onData(data: any) {
    logger.debug('Data on port: ', data);
    this.lastActivityTime = process.hrtime();
  }

  private onError(error: Error) {
    logger.error(error);
    this.shutdown(this.startup);
  }

  private onMessage(message: IncommingMessage) {
    logger.debug(
      'Raw Message: ',
      message.src,
      message.len,
      message.dst,
      message.msg,
      '[' + message.msg.toString('ascii') + ']',
      message.crc,
    );

    this.emit('data', message);
  }

  public sendMessage(message: OutgoingMessage) {
    const dataBuf = createIbusMessage(message);
    logger.debug('Send message: ', dataBuf);

    if (this.queue.length > 1000) {
      logger.warning('Queue too large, dropping message..', dataBuf);
      return;
    }

    this.queue.unshift(dataBuf);
  }

  public startup() {
    this.serialPort.open((error) => {
      if (error) {
        logger.error(error);
      } else {
        logger.info('Port Open.');
        this.serialPort.on('data', this.onData);
        this.serialPort.on('error', this.onError);

        if (!this.parser) return;

        this.serialPort.pipe(this.parser);
        this.parser.on('message', this.onMessage);

        this.watchForEmptyBus(this.processWriteQueue);
      }
    });
  }

  public shutdown(callback: Callback) {
    logger.info('Shutting down Ibus device..');
    this.serialPort.close((error) => {
      if (error) {
        logger.error(error);
      } else {
        logger.info('Port Closed.');
        this.parser = null;
      }

      callback();
    });
  }
}

export { IbusInterface };
