import autoBind from 'auto-bind';

import { Base } from '../base';
import { interfaces } from '../constants';

import { IbusInterface } from './IbusInterface.js';
import { IncommingMessage } from './types.js';

class IbusReader extends Base {
  ibusInterface: IbusInterface;

  constructor(ibusInterface: IbusInterface) {
    super('IbusReader');
    this.ibusInterface = ibusInterface;

    autoBind(this);

    process.on('SIGINT', this.onSignalInt);
    this.ibusInterface.on('data', this.onIbusData);
  }

  private onSignalInt() {
    this.ibusInterface.shutdown(() => {
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
    this.logger.info(`Id: ${data.id}`);
    this.logger.info(`From: ${this.getDeviceName(data.src)}`);
    this.logger.info(`To: ${this.getDeviceName(data.dst)}`);
    this.logger.info(`Message: ${data.msg}`);
    this.logger.info('------------------------------------');
  }
}

export { IbusReader };
