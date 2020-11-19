import autoBind from 'auto-bind';

import { compareify, isEq, repeat } from '../utils';
import { IbusInterface, IncommingMessage } from '../ibus';
import { Base } from '../base';
import { RemoteControlClient } from '../types';

import { RemoteClients } from './types';
import { XbmcClient } from '../clients';

class IbusEventListener extends Base {
  ibusInterface: IbusInterface;
  remoteControlClients: RemoteClients = {};
  key?: string;

  constructor(ibusInterface: IbusInterface) {
    super('IbusEventListener');

    this.ibusInterface = ibusInterface;

    autoBind(this);

    this.ibusInterface.on('data', this.onData);
  }

  public setRemoteControlClient(key: string, remoteControlClient: RemoteControlClient) {
    this.key = key;
    this.remoteControlClients[key] = remoteControlClient;
  }

  private onData(data: IncommingMessage) {
    this.logger.debug(data);

    const cmpData = compareify(data.src, data.dst, data.msg);

    // 1
    if (isEq(cmpData, compareify('f0', '68', Buffer.from([0x48, 0x11])))) {
      if (this.key) this.remoteControlClients[this.key].select();
    }

    // 2
    if (isEq(cmpData, compareify('f0', '68', Buffer.from([0x48, 0x01])))) {
      if (this.key) this.remoteControlClients[this.key].back();
    }

    // 3
    if (isEq(cmpData, compareify('f0', '68', Buffer.from([0x48, 0x12])))) {
      if (this.key === 'xbmc') (this.remoteControlClients[this.key] as XbmcClient).contextMenu();
    }

    // 4
    if (isEq(cmpData, compareify('f0', '68', Buffer.from([0x48, 0x02])))) {
      //this.remoteControlClients['xbmc'].right();
    }

    // 5
    if (isEq(cmpData, compareify('f0', '68', Buffer.from([0x48, 0x13])))) {
      if (this.key) this.remoteControlClients[this.key].left();
    }

    // 6
    if (isEq(cmpData, compareify('f0', '68', Buffer.from([0x48, 0x03])))) {
      if (this.key) this.remoteControlClients[this.key].right();
    }

    // nav turn knob push
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x48, 0x05])))) {
      if (this.key) this.remoteControlClients[this.key].select();
    }

    // nav turn knob push
    if (isEq(cmpData, compareify('50', '68', Buffer.from([0x3b, 0x28])))) {
      if (this.key === 'xbmc') (this.remoteControlClients[this.key] as XbmcClient).previous();
    }

    // nav turn knob push
    if (isEq(cmpData, compareify('50', '68', Buffer.from([0x3b, 0x21])))) {
      if (this.key === 'xbmc') (this.remoteControlClients[this.key] as XbmcClient).next();
    }

    // TURN WHEEL LEFT

    // 49 0n - rotate left 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x01])))) {
      if (this.key) repeat(this.remoteControlClients[this.key].down, 1);
    }

    // 49 0n - rotate left 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x02])))) {
      if (this.key) repeat(this.remoteControlClients[this.key].down, 1);
    }

    // 49 0n - rotate left 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x03])))) {
      if (this.key) repeat(this.remoteControlClients[this.key].down, 2);
    }

    // 49 0n - rotate left 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x04])))) {
      if (this.key) repeat(this.remoteControlClients[this.key].down, 2);
    }

    // 49 0n - rotate left 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x05])))) {
      if (this.key) repeat(this.remoteControlClients[this.key].down, 3);
    }

    // 49 0n - rotate left 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x06])))) {
      if (this.key) repeat(this.remoteControlClients[this.key].down, 3);
    }

    // 49 0n - rotate left 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x7])))) {
      if (this.key) repeat(this.remoteControlClients[this.key].down, 3);
    }

    // 49 0n - rotate left 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x08])))) {
      if (this.key) repeat(this.remoteControlClients[this.key].down, 4);
    }

    // 49 0n - rotate left 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x09])))) {
      if (this.key) repeat(this.remoteControlClients[this.key].down, 4);
    }

    // TURN WHEEL RIGHT

    // 49 8n - rotate right 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x81])))) {
      if (this.key) repeat(this.remoteControlClients[this.key].up, 1);
    }

    // 49 8n - rotate right 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x82])))) {
      if (this.key) repeat(this.remoteControlClients[this.key].up, 1);
    }

    // 49 8n - rotate right 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x83])))) {
      if (this.key) repeat(this.remoteControlClients[this.key].up, 2);
    }

    // 49 8n - rotate right 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x84])))) {
      if (this.key) repeat(this.remoteControlClients[this.key].up, 2);
    }

    // 49 8n - rotate right 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x85])))) {
      if (this.key) repeat(this.remoteControlClients[this.key].up, 3);
    }

    // 49 8n - rotate right 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x86])))) {
      if (this.key) repeat(this.remoteControlClients[this.key].up, 3);
    }

    // 49 8n - rotate right 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x87])))) {
      if (this.key) repeat(this.remoteControlClients[this.key].up, 3);
    }

    // 49 8n - rotate right 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x88])))) {
      if (this.key) repeat(this.remoteControlClients[this.key].up, 4);
    }

    // 49 8n - rotate right 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x89])))) {
      if (this.key) repeat(this.remoteControlClients[this.key].up, 4);
    }
  }
}

export { IbusEventListener };
