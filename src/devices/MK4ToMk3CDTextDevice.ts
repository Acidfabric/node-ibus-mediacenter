import autoBind from 'auto-bind';

import { IbusInterface, IncommingMessage } from '../ibus';
import { Encoding } from '../constants';

import { GraphicsNavigationOutputDevice } from './GraphicsNavigationOutputDevice';

class MK4ToMk3CDTextDevice {
  private ibusInterface: IbusInterface;
  private navOutput: GraphicsNavigationOutputDevice;
  private sourceId: string;
  private artist: Buffer;
  private title: Buffer;
  private album: Buffer;

  constructor(ibusInterface: IbusInterface, navOutput: GraphicsNavigationOutputDevice) {
    this.ibusInterface = ibusInterface;
    this.navOutput = navOutput;

    this.sourceId = '3b';
    this.artist = Buffer.from('');
    this.title = Buffer.from('');
    this.album = Buffer.from('');

    autoBind(this);

    this.ibusInterface.on('data', this.onData);
  }

  private onData(data: IncommingMessage) {
    const dataInfo = Buffer.from([0xa5, 0x63, 0x01]).toString();
    const dataFlush = Buffer.from([0xa5, 0x63, 0x00, 0x00]).toString();
    const intro = data.msg.slice(0, 3).toString();

    if (data.dst === this.sourceId) {
      if (data.msg.toString() === dataFlush) {
        this.navOutput.setOption(0, '--NowPlaying--');
        this.navOutput.setOption(1, this.artist.toString(Encoding.Ascii));
        this.navOutput.setOption(2, this.title.toString(Encoding.Ascii));
        this.navOutput.setOption(3, '---------------');
        this.navOutput.setOption(4, this.album.toString(Encoding.Ascii));
        this.navOutput.setOption(5, '');
        this.navOutput.setOption(6, '');
        this.navOutput.setOption(7, '');
        this.navOutput.setOption(8, '');
        this.navOutput.setOption(9, '');

        this.navOutput.refreshOptions();
      }

      if (dataInfo === intro) {
        switch (data.msg[3]) {
          case 0x41:
            this.artist = data.msg.slice(4);
          case 0x42:
            this.title = data.msg.slice(4);
          case 0x43:
            this.album = data.msg.slice(4);
          default:
            break;
        }
      }
    }
  }
}

export { MK4ToMk3CDTextDevice };
