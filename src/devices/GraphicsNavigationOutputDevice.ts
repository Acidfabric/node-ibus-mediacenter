import { interfaces, messages } from '../constants';
import { IbusInterface } from '../ibus';
import { getPaddedLenBuf } from '../utils';

class GraphicsNavigationOutputDevice {
  private deviceName = 'BordMonitorOutput';
  private ibusInterface: IbusInterface;

  constructor(ibusInterface: IbusInterface) {
    this.ibusInterface = ibusInterface;
  }

  public updateScreen() {
    this.ibusInterface.sendMessage(messages.navigation.updateScreen);
  }

  public refreshOptions() {
    this.ibusInterface.sendMessage(messages.navigation.refreshOptions);
  }

  public refreshTop() {
    this.ibusInterface.sendMessage(messages.navigation.refreshTop);
  }

  public showStatus() {
    this.ibusInterface.sendMessage(messages.navigation.showStatus);
  }

  public setTitle(text: string) {
    this.ibusInterface.sendMessage({
      src: interfaces.Radio,
      dst: interfaces.GraphicsNavigationDriver,
      msg: Buffer.concat([Buffer.from([0x23, 0x62, 0x10]), getPaddedLenBuf(text, 11)]),
    });
  }

  public setOption(index: number, text: string) {
    // 0 to 9
    const indexCode = index === 7 ? 0x07 : 0x40 + index;

    this.ibusInterface.sendMessage({
      src: interfaces.Radio,
      dst: interfaces.GraphicsNavigationDriver,
      msg: Buffer.concat([Buffer.from([0x21, 0x60, 0x00, indexCode]), getPaddedLenBuf(text, 14)]),
    });
  }

  public setZone(index: number, text: string) {
    // 0 to 6
    const indexCode = 0x41 + index;

    let len = 0;

    if (index <= 3) len = 5;
    if (index === 4) len = 7;
    if (5 <= index && index <= 6) len = 20;

    this.ibusInterface.sendMessage({
      src: interfaces.Radio,
      dst: interfaces.GraphicsNavigationDriver,
      msg: Buffer.concat([Buffer.from([0xa5, 0x62, 0x01, indexCode]), getPaddedLenBuf(text, len)]),
    });
  }
}

export default GraphicsNavigationOutputDevice;
