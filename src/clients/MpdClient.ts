import { cmd, connect } from 'mpd';
import autoBind from 'auto-bind';

import { Base } from '../base';
import { config } from '../constants';

class MpdClient extends Base {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private client: any;

  constructor() {
    super('MpdClient');

    this.client = connect(config.mpdConnection);

    autoBind(this);

    this.setupClient();
  }

  private callback(err: Error, msg: string) {
    if (err) this.logger.error(msg);
    this.logger.info(msg);
  }

  private setupClient() {
    this.client.on('ready', () => {
      this.logger.info('Client ready.');
    });

    this.client.on('system', (name: string) => {
      this.logger.info(`Client update ${name}`);
    });

    this.client.on('system-player', () => {
      const command = cmd('status', []);
      this.client.sendCommand(command, this.callback);
    });
  }

  public play() {
    const command = cmd('play', []);
    this.client.sendCommand(command, this.callback);
  }

  public stop() {
    const command = cmd('stop', []);
    this.client.sendCommand(command, this.callback);
  }

  public pause() {
    const command = cmd('pause', []);
    this.client.sendCommand(command, this.callback);
  }

  public next() {
    const command = cmd('next', []);
    this.client.sendCommand(command, this.callback);
  }

  public previous() {
    const command = cmd('previous', []);
    this.client.sendCommand(command, this.callback);
  }

  public info() {
    const command = cmd('list directory', []);
    //this.client.sendCommand(cmd("currentsong", []), this.callback);
    this.client.sendCommand(command, this.callback);
  }
}

export { MpdClient };
