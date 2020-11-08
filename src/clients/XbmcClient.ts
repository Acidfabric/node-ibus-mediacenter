import Xbmc from 'xbmc';

import loggerSystem from '../logger';
import { config } from '../config';
import { RemoteControlClient } from '../types/remoteControlClient';

const logger = loggerSystem.child({ service: 'XbmcClient' });

class XbmcClient implements RemoteControlClient {
  private xbmcApi: any;

  constructor() {
    this.setupXbmc();
  }

  private setupXbmc() {
    const connection = new Xbmc.TCPConnection({
      host: config.xbmcHost,
      port: config.xbmcPort,
      verbose: true,
      username: config.xbmcUsername,
      password: config.xbmcPassword,
    });

    this.xbmcApi = new Xbmc.XbmcApi({ silent: true });
    this.xbmcApi.setConnection(connection);

    this.xbmcApi.on('connection:data', (data: any) => {
      logger.debug('Data', data);
    });

    this.xbmcApi.on('connection:open', () => {
      logger.debug('Connection open');
    });

    this.xbmcApi.on('connection:close', () => {
      logger.debug('Closing');
    });

    this.xbmcApi.on('error', (error: Error) => {
      logger.error(error);
    });
  }

  public previous() {
    this.xbmcApi.input.ExecuteAction('skipprevious');
  }

  public next() {
    logger.debug('Sending next');
    this.xbmcApi.input.ExecuteAction('skipnext');
  }

  public up() {
    this.xbmcApi.input['Up']();
  }

  public down() {
    this.xbmcApi.input['Down']();
  }

  public left() {
    this.xbmcApi.input['Left']();
  }

  public right() {
    this.xbmcApi.input['Right']();
  }

  public select() {
    this.xbmcApi.input['Select']();
  }

  public back() {
    this.xbmcApi.input['Back']();
  }

  public contextMenu() {
    this.xbmcApi.input['ContextMenu']();
  }
}

export default XbmcClient;