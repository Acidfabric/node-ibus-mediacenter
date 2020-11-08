import { cmd, connect } from 'mpd';

import { config } from '../config';
import loggerSystem from '../logger';

const logger = loggerSystem.child({ service: 'MpdClient' });

class MpdClient {
  private client: any;

  constructor() {
    this.client = connect({
      port: config.mpdPort,
      host: config.mpdHost,
    });

    this.setupClient();
  }

  private setupClient() {
    this.client.on('ready', function () {
      logger.info('Ready.');
    });

    this.client.on('system', (name: string) => {
      logger.info('Update', name);
    });

    this.client.on('system-player', () => {
      const command = cmd('status', []);
      this.client.sendCommand(command, this.logResultMessage);
    });
  }

  private logResultMessage(err: Error, msg: string) {
    if (err) logger.error('Error', msg);
    logger.info('Log', msg);
  }

  public play() {
    const command = cmd('play', []);
    this.client.sendCommand(command, this.logResultMessage);
  }

  public stop() {
    const command = cmd('stop', []);
    this.client.sendCommand(command, this.logResultMessage);
  }

  public pause() {
    const command = cmd('pause', []);
    this.client.sendCommand(command, this.logResultMessage);
  }

  public next() {
    const command = cmd('next', []);
    this.client.sendCommand(command, this.logResultMessage);
  }

  public previous() {
    const command = cmd('previous', []);
    this.client.sendCommand(command, this.logResultMessage);
  }

  public info() {
    const command = cmd('list directory', []);
    //this.client.sendCommand(cmd("currentsong", []), this.logResultMessage);
    this.client.sendCommand(command, this.logResultMessage);
  }
}

export default MpdClient;
