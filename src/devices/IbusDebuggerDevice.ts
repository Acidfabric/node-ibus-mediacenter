import autoBind from 'auto-bind';

import { IbusInterface, IncommingMessage } from '../ibus';
import loggerSystem from '../logger';
import { messages } from '../constants';

const logger = loggerSystem.child({ service: 'IbusDebuggerListener' });

class IbusDebuggerDevice {
  ibusInterface: IbusInterface;
  deviceName = 'Ibus Debugger';
  listenDeviceIds?: string[];

  constructor(ibusInterface: IbusInterface, listenDeviceIds?: string[]) {
    logger.debug('Starting up..');

    this.ibusInterface = ibusInterface;
    this.listenDeviceIds = listenDeviceIds;
    this.ibusInterface.on('data', this.onData);

    autoBind(this);
  }

  private onData(data: IncommingMessage) {
    logger.debug(data);
    if (this.listenDeviceIds?.find((val) => val === data.dst)) {
      let msg = '';

      data.msg.forEach((_message, index) => {
        msg += ', 0x' + (data.msg[index] < 0x10 ? '0' : '') + data.msg[index].toString(16);
      });

      logger.debug('debug message', msg);
    }
  }

  public srl() {
    this.ibusInterface.sendMessage(messages.debugger.simulateRotateLeft);
  }

  public srr() {
    this.ibusInterface.sendMessage(messages.debugger.simulateRotateRight);
  }

  public up() {
    this.ibusInterface.sendMessage(messages.debugger.simulateUp);
  }

  public down() {
    this.ibusInterface.sendMessage(messages.debugger.simulateDown);
  }

  public left() {
    this.ibusInterface.sendMessage(messages.debugger.simulateLeft);
  }

  public right() {
    this.ibusInterface.sendMessage(messages.debugger.simulateRight);
  }

  public select() {
    this.ibusInterface.sendMessage(messages.debugger.simulateSelect);
  }

  public back() {
    this.ibusInterface.sendMessage(messages.debugger.simulateBack);
  }
}

export { IbusDebuggerDevice };
