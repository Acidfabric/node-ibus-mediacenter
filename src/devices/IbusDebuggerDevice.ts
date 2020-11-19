import autoBind from 'auto-bind';

import { IbusInterface, IncommingMessage } from '../ibus';
import { Base } from '../base';
import { messages } from '../constants';

class IbusDebuggerDevice extends Base {
  ibusInterface: IbusInterface;
  listenDeviceIds?: string[];

  constructor(ibusInterface: IbusInterface, listenDeviceIds?: string[]) {
    super('IbusDebugger');

    this.logger.debug('Starting up..');

    this.ibusInterface = ibusInterface;
    this.listenDeviceIds = listenDeviceIds;
    this.ibusInterface.on('data', this.onData);

    autoBind(this);
  }

  private onData(data: IncommingMessage) {
    this.logger.debug(data);
    if (this.listenDeviceIds?.find((val) => val === data.dst)) {
      let msg = '';

      data.msg.forEach((_message, index) => {
        msg += ', 0x' + (data.msg[index] < 0x10 ? '0' : '') + data.msg[index].toString(16);
      });

      this.logger.debug(`debug message ${msg}`);
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
