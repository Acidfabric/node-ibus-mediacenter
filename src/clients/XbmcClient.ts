import autoBind from 'auto-bind';
import Xbmc from 'xbmc';

import { Base } from '../base';
import { config } from '../constants';
import { RemoteControlClient } from '../types/remoteControlClient';

class XbmcClient extends Base implements RemoteControlClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private xbmcApi: any;

  constructor() {
    super('XbmcClient');

    autoBind(this);

    this.setupXbmc();
  }

  private setupXbmc() {
    const connection = new Xbmc.TCPConnection(config.xbmcConnection);

    this.xbmcApi = new Xbmc.XbmcApi({ silent: true });
    this.xbmcApi.setConnection(connection);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.xbmcApi.on('connection:data', (data: any) => {
      this.logger.debug(`Client data. ${data}`);
    });

    this.xbmcApi.on('connection:open', () => {
      this.logger.debug('Client connection open.');
    });

    this.xbmcApi.on('connection:close', () => {
      this.logger.debug('Client connection closing.');
    });

    this.xbmcApi.on('error', (error: Error) => {
      this.logger.error(error);
    });
  }

  public previous() {
    this.xbmcApi.input.ExecuteAction('skipprevious');
  }

  public next() {
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

export { XbmcClient };
