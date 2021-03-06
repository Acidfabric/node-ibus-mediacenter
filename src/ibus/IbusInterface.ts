import autoBind from 'auto-bind';
import { EventEmitter } from 'events';
import SerialPort from 'serialport';

import { config, Encoding } from '../constants';
import { createIbusMessage, timePassed } from '../utils';
import { Callback } from '../types';
import loggerSystem from '../logger';

import { IncommingMessage, OutgoingMessage } from './types';
import IbusProtocol from './IbusProtocol';

const logger = loggerSystem.child({ service: 'IbusInterface' });

class IbusInterface extends EventEmitter {
  private serialPort: SerialPort;
  private parser: IbusProtocol | null;
  private queue: Buffer[];
  private lastActivityTime: [number, number];

  constructor() {
    super();

    this.serialPort = new SerialPort(config.device, config.iBusConnection);
    this.parser = new IbusProtocol();
    this.queue = [];
    this.lastActivityTime = process.hrtime();

    autoBind(this);
  }

  private watchForEmptyBus(workerFn: (callback: Callback) => void) {
    if (timePassed(this.lastActivityTime) >= 20) {
      workerFn(() => setImmediate(this.watchForEmptyBus, workerFn));
      return;
    }

    setImmediate(this.watchForEmptyBus, workerFn);
  }

  private processWriteQueue(callback: Callback) {
    if (!this.queue.length) {
      callback();
      return;
    }

    const dataBuf = this.queue.pop();

    if (!dataBuf) return;

    logger.debug(`Write queue length: ${this.queue.length}`);

    this.serialPort.write(dataBuf, (error, resp) => {
      if (error) {
        logger.error(`Failed to write ${error}`);
        return;
      }

      logger.info(`Wrote to Device: ${dataBuf.toString(Encoding.Hex)} ${resp}`);

      this.serialPort.drain((error) => {
        if (error) {
          logger.error(`Failed to drain ${error}`);
          return;
        }

        this.lastActivityTime = process.hrtime();
        callback();
      });
    });
  }

  private onData(data: Buffer) {
    logger.debug(`Data on port: ${data.toString(Encoding.Hex)}`);
    this.lastActivityTime = process.hrtime();
  }

  private onError(error: Error) {
    logger.error(error);
    this.shutdown(this.startup);
  }

  private onMessage(msg: IncommingMessage) {
    logger.debug(
      `Raw Message: ${msg.src} ${msg.len} ${msg.dst} ${msg.msg} [${msg.msg.toString(Encoding.Ascii)}] ${msg.crc}`,
    );

    this.emit('data', msg);
  }

  public sendMessage(message: OutgoingMessage) {
    const dataBuf = createIbusMessage(message);
    logger.debug(`Send message: ${dataBuf}`);

    if (this.queue.length > 1000) {
      logger.warning(`Queue too large, dropping message.. ${dataBuf}`);
      return;
    }

    this.queue.unshift(dataBuf);
  }

  public startup() {
    this.serialPort.open((error) => {
      if (error) {
        logger.error(error);
        return;
      }

      logger.info('Port Open.');
      this.serialPort.on('data', this.onData);
      this.serialPort.on('error', this.onError);

      if (!this.parser) return;

      this.serialPort.pipe(this.parser);
      this.parser.on('message', this.onMessage);

      this.watchForEmptyBus(this.processWriteQueue);
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
