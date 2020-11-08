import keypress from 'keypress';

import { RemoteControlClient } from '../types';
import XbmcClient from '../clients/XbmcClient';
import IbusDebuggerDevice from '../devices/IbusDebuggerDevice';
import loggerSystem from '../logger';

import { RemoteClients } from './types';

const logger = loggerSystem.child({ service: 'KeyboardEventListener' });

class KeyboardEventListener {
  private remoteControlClient: RemoteClients = {};
  private callback?: () => void;

  constructor(callback?: () => void) {
    this.callback = callback;
    this.setupKeyboardListiner();
  }

  public setRemoteControlClient(key: string, remoteControlClient: RemoteControlClient) {
    this.remoteControlClient[key] = remoteControlClient;
  }

  private setupKeyboardListiner() {
    logger.info('Starting up..');

    // make `process.stdin` begin emitting "keypress" events
    keypress(process.stdin);

    process.stdin.on('keypress', (ch, key) => {
      logger.debug('got "keypress"', ch, key);
      if (!(key && key.name)) {
        key = {
          name: ch,
        };
      }

      if (key && key.ctrl && key.name == 'c') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        process.emit('SIGINT');
      }

      if (key && key.ctrl && key.name == 'z') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        process.emit('SIGTERM');
      }

      if (key.name === 'w') {
        this.remoteControlClient['ibus'].up();
      }

      if (key.name === 'a') {
        this.remoteControlClient['ibus'].left();
      }

      if (key.name === 's') {
        this.remoteControlClient['ibus'].down();
      }

      if (key.name === 'd') {
        this.remoteControlClient['ibus'].right();
      }

      if (key.name === 'q') {
        this.remoteControlClient['ibus'].back();
      }

      if (key.name === 'e') {
        this.remoteControlClient['ibus'].select();
      }

      if (key.name === '[') {
        (this.remoteControlClient['ibus'] as IbusDebuggerDevice).srl();
      }

      if (key.name === ']') {
        (this.remoteControlClient['ibus'] as IbusDebuggerDevice).srr();
      }

      if (key.name === 'up') {
        this.remoteControlClient['xbmc'].up();
      }
      if (key.name === 'down') {
        this.remoteControlClient['xbmc'].down();
      }
      if (key.name === 'left') {
        this.remoteControlClient['xbmc'].left();
      }
      if (key.name === 'right') {
        this.remoteControlClient['xbmc'].right();
      }
      if (key.name === 'return') {
        this.remoteControlClient['xbmc'].select();
      }
      if (key.name === 'escape') {
        this.remoteControlClient['xbmc'].back();
      }
      if (key.name === 'i') {
        (this.remoteControlClient['xbmc'] as XbmcClient).contextMenu();
      }
    });

    process.stdin.setRawMode(true);
    process.stdin.resume();

    if (this.callback) {
      this.callback();
    }
  }
}

export default KeyboardEventListener;
