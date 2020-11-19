import autoBind from 'auto-bind';
import readline from 'readline';

import { Base } from '../base';
import { IbusDebuggerDevice } from '../devices';
import { RemoteControlClient } from '../types';
import { XbmcClient } from '../clients';

import { RemoteClients } from './types';

class KeyboardEventListener extends Base {
  private key: string;
  private remoteControlClient: RemoteClients = {};

  constructor(key: string, remoteControlClient: RemoteControlClient) {
    super('KeyboardEventListener');

    this.key = key;
    this.remoteControlClient[key] = remoteControlClient;

    autoBind(this);

    this.setupKeyboardListiner();
  }

  private setupKeyboardListiner() {
    this.logger.info('Starting up..');

    readline.emitKeypressEvents(process.stdin);

    process.stdin.on('keypress', (str, key) => {
      this.logger.debug(`got "keypress" ${str} ${JSON.stringify(key)}`);

      if (!key?.name) key = { name: str };

      if (key.ctrl && key.name == 'c') {
        process.emit('SIGINT', 'SIGINT');
      }

      if (key.ctrl && key.name == 'z') {
        process.emit('SIGTERM', 'SIGTERM');
      }

      if (key.name === 'w') {
        this.remoteControlClient[this.key].up();
      }

      if (key.name === 'a') {
        this.remoteControlClient[this.key].left();
      }

      if (key.name === 's') {
        this.remoteControlClient[this.key].down();
      }

      if (key.name === 'd') {
        this.remoteControlClient[this.key].right();
      }

      if (key.name === 'q') {
        this.remoteControlClient[this.key].back();
      }

      if (key.name === 'e') {
        this.remoteControlClient[this.key].select();
      }

      if (key.name === '[') {
        (this.remoteControlClient[this.key] as IbusDebuggerDevice).srl();
      }

      if (key.name === ']') {
        (this.remoteControlClient[this.key] as IbusDebuggerDevice).srr();
      }

      if (key.name === 'i') {
        if (this.key === 'xbmc') (this.remoteControlClient['xbmc'] as XbmcClient).contextMenu();
      }
    });

    process.stdin.setRawMode(true);
    process.stdin.resume();
  }
}

export { KeyboardEventListener };
