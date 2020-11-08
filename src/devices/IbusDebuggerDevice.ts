import { IbusInterface, IncommingMessage } from '../ibus';
import loggerSystem from '../logger';

const logger = loggerSystem.child({ service: 'IbusDebuggerListener' });

class IbusDebuggerDevice {
  ibusInterface: IbusInterface;
  deviceName = 'Ibus Debugger';
  listenDeviceIds?: string[];

  constructor(ibusInterface: IbusInterface) {
    logger.debug('Starting up..');

    this.ibusInterface = ibusInterface;
    this.ibusInterface.on('data', this.onData);
  }

  private onData(data: IncommingMessage) {
    logger.debug(data);
    if (this.listenDeviceIds?.find((val) => val === data.dst)) {
      let msg = '';

      data.msg.forEach((_message, index) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        msg += ', 0x' + (data.msg[index] < 0x10 ? '0' : '') + data.msg[index].toString(16);
      });

      // for (var i = 0; i < data.msg.length; i++) {
      //   msg += ', 0x' + ((data.msg[i] < 0x10) ? '0' : '') + data.msg[i].toString(16);
      // }

      // logger.info(data);

      //console.log('// ' + data.msg.toString('ascii'));
      //console.log('ibusInterface.sendMessage({src: 0x' + data.src + ',dst: 0x' + data.dst + ', msg: new Buffer([' + msg.substr(2), '])});');
    }
  }

  // simulateRotateLeft;
  public srl() {
    this.ibusInterface.sendMessage({
      src: 0xf0,
      dst: 0x68,
      msg: Buffer.from([0x49, 0x03]),
    });
  }

  // simulateRotateRight;
  public srr() {
    this.ibusInterface.sendMessage({
      src: 0xf0,
      dst: 0x68,
      msg: Buffer.from([0x49, 0x83]),
    });
  }

  public up() {
    this.ibusInterface.sendMessage({
      src: 0xf0,
      dst: 0x68,
      msg: Buffer.from([0x48, 0x13]),
    });
  }

  public left() {
    this.ibusInterface.sendMessage({
      src: 0xf0,
      dst: 0x68,
      msg: Buffer.from([0x48, 0x12]),
    });
  }

  public down() {
    this.ibusInterface.sendMessage({
      src: 0xf0,
      dst: 0x68,
      msg: Buffer.from([0x48, 0x03]),
    });
  }

  public right() {
    this.ibusInterface.sendMessage({
      src: 0xf0,
      dst: 0x68,
      msg: Buffer.from([0x48, 0x02]),
    });
  }

  public select() {
    this.ibusInterface.sendMessage({
      src: 0xf0,
      dst: 0x68,
      msg: Buffer.from([0x48, 0x05]),
    });
  }

  public back() {
    this.ibusInterface.sendMessage({
      src: 0xf0,
      dst: 0x68,
      msg: Buffer.from([0x48, 0x01]),
    });
  }
}

export default IbusDebuggerDevice;
