import autoBind from 'auto-bind';

import { interfaces } from '../constants';
import loggerSystem from '../logger';

import { IbusInterface } from './IbusInterface.js';
import { IncommingMessage } from './types.js';

const logger = loggerSystem.child({ service: 'IbusReader' });

class IbusReader {
  ibusInterface: IbusInterface;

  constructor(ibusInterface: IbusInterface) {
    this.ibusInterface = ibusInterface;

    autoBind(this);

    process.on('SIGINT', this.onSignalInt);
    this.ibusInterface.on('data', this.onIbusData);
  }

  private onSignalInt() {
    this.ibusInterface.shutdown(function () {
      process.exit();
    });
  }

  private getDeviceName(key: string) {
    const hkey = parseInt(key, 16);
    const data = Object.entries(interfaces).filter(([_key, value]) => value === hkey);

    if (!data.length) return 'Unknown Device' + ' - ' + key;

    return data[0][0] + ' - ' + hkey;
  }

  private onIbusData(data: IncommingMessage) {
    logger.info(`Id: ${data.id}`);
    logger.info(`From: ${this.getDeviceName(data.src)}`);
    logger.info(`To: ${this.getDeviceName(data.dst)}`);
    logger.info(`Message: ${data.msg}`);
    logger.info('------------------------------------');
  }
}

export { IbusReader };
