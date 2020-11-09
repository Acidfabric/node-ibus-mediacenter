import autoBind from 'auto-bind';

import { compareify, isEq, repeat } from '../utils';
import { IbusInterface, IncommingMessage } from '../ibus';
import loggerSystem from '../logger';
import { RemoteControlClient } from '../types';

import { RemoteClients } from './types';
import { XbmcClient } from '../clients';

const logger = loggerSystem.child({ service: 'IbusEventListener' });

class IbusEventListener {
  ibusInterface: IbusInterface;
  remoteControlClients: RemoteClients = {};

  constructor(ibusInterface: IbusInterface) {
    this.ibusInterface = ibusInterface;

    autoBind(this);

    this.ibusInterface.on('data', this.onData);
  }

  public setRemoteControlClient(key: string, remoteControlClient: RemoteControlClient) {
    this.remoteControlClients[key] = remoteControlClient;
  }

  private onData(data: IncommingMessage) {
    logger.debug(data);

    const cmpData = compareify(data.src, data.dst, data.msg);

    // 1
    if (isEq(cmpData, compareify('f0', '68', Buffer.from([0x48, 0x11])))) {
      this.remoteControlClients['xbmc'].select();
    }

    // 2
    if (isEq(cmpData, compareify('f0', '68', Buffer.from([0x48, 0x01])))) {
      this.remoteControlClients['xbmc'].back();
    }

    // 3
    if (isEq(cmpData, compareify('f0', '68', Buffer.from([0x48, 0x12])))) {
      (this.remoteControlClients['xbmc'] as XbmcClient).contextMenu();
    }

    // 4
    if (isEq(cmpData, compareify('f0', '68', Buffer.from([0x48, 0x02])))) {
      //this.remoteControlClients['xbmc'].right();
    }

    // 5
    if (isEq(cmpData, compareify('f0', '68', Buffer.from([0x48, 0x13])))) {
      this.remoteControlClients['xbmc'].left();
    }

    // 6
    if (isEq(cmpData, compareify('f0', '68', Buffer.from([0x48, 0x03])))) {
      this.remoteControlClients['xbmc'].right();
    }

    // nav turn knob push
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x48, 0x05])))) {
      this.remoteControlClients['xbmc'].select();
    }

    // nav turn knob push
    if (isEq(cmpData, compareify('50', '68', Buffer.from([0x3b, 0x28])))) {
      (this.remoteControlClients['xbmc'] as XbmcClient).previous();
    }

    // nav turn knob push
    if (isEq(cmpData, compareify('50', '68', Buffer.from([0x3b, 0x21])))) {
      (this.remoteControlClients['xbmc'] as XbmcClient).next();
    }

    // TURN WHEEL LEFT

    // 49 0n - rotate left 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x01])))) {
      repeat(this.remoteControlClients['xbmc'].down, 1);
    }

    // 49 0n - rotate left 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x02])))) {
      repeat(this.remoteControlClients['xbmc'].down, 1);
    }

    // 49 0n - rotate left 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x03])))) {
      repeat(this.remoteControlClients['xbmc'].down, 2);
    }

    // 49 0n - rotate left 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x04])))) {
      repeat(this.remoteControlClients['xbmc'].down, 2);
    }

    // 49 0n - rotate left 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x05])))) {
      repeat(this.remoteControlClients['xbmc'].down, 3);
    }

    // 49 0n - rotate left 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x06])))) {
      repeat(this.remoteControlClients['xbmc'].down, 3);
    }

    // 49 0n - rotate left 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x7])))) {
      repeat(this.remoteControlClients['xbmc'].down, 3);
    }

    // 49 0n - rotate left 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x08])))) {
      repeat(this.remoteControlClients['xbmc'].down, 4);
    }

    // 49 0n - rotate left 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x09])))) {
      repeat(this.remoteControlClients['xbmc'].down, 4);
    }

    // TURN WHEEL RIGHT

    // 49 8n - rotate right 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x81])))) {
      repeat(this.remoteControlClients['xbmc'].up, 1);
    }

    // 49 8n - rotate right 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x82])))) {
      repeat(this.remoteControlClients['xbmc'].up, 1);
    }

    // 49 8n - rotate right 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x83])))) {
      repeat(this.remoteControlClients['xbmc'].up, 2);
    }

    // 49 8n - rotate right 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x84])))) {
      repeat(this.remoteControlClients['xbmc'].up, 2);
    }

    // 49 8n - rotate right 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x85])))) {
      repeat(this.remoteControlClients['xbmc'].up, 3);
    }

    // 49 8n - rotate right 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x86])))) {
      repeat(this.remoteControlClients['xbmc'].up, 3);
    }

    // 49 8n - rotate right 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x87])))) {
      repeat(this.remoteControlClients['xbmc'].up, 3);
    }

    // 49 8n - rotate right 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x88])))) {
      repeat(this.remoteControlClients['xbmc'].up, 4);
    }

    // 49 8n - rotate right 1..9
    if (isEq(cmpData, compareify('f0', '3b', Buffer.from([0x49, 0x89])))) {
      repeat(this.remoteControlClients['xbmc'].up, 4);
    }
  }
}

export { IbusEventListener };
