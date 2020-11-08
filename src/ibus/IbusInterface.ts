import SerialPort from 'serialport';
import { EventEmitter } from 'events';

import { Callback } from '../types';
import loggerSystem from '../logger';
import { getHrDiffTime } from '../utils';

import IbusProtocol from './IbusProtocol';
import { IncommingMessage, OutgoingMessage } from './types';

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
      baudRate: 9600,
      parity: 'even',
      stopBits: 1,
      dataBits: 8,
    });
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

  private processWriteQueue(ready: Callback) {
    if (this.queue.length <= 0) {
      ready();
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
          ready();
        });
      }
    });
  }

  private onData(data: any) {
    logger.debug('Data on port: ', data);
    this.lastActivityTime = process.hrtime();
  }

  private onError(error: Error) {
    logger.error('Error', error);
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
    const dataBuf = IbusProtocol.createIbusMessage(message);
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
        logger.error(error.message);
      } else {
        logger.info('Port Open.');
        this.serialPort.on('data', this.onData);
        this.serialPort.on('error', this.onError);

        if (!this.parser) return;

        this.parser.on('message', this.onMessage);
        this.serialPort.pipe(this.parser);
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
