import { Transform, TransformCallback, TransformOptions } from 'stream';
import autoBind from 'auto-bind';

import loggerSystem from '../logger';

import { IncommingMessage } from './types';

const logger = loggerSystem.child({ service: 'IbusProtocol' });

class IbusProtocol extends Transform {
  private buffer: Buffer;
  private isProcessing: boolean;
  private processId: number;

  constructor(options: TransformOptions = {}) {
    super(options);

    this.buffer = Buffer.alloc(0);
    this.processId = 0;
    this.isProcessing = false;

    autoBind(this);
  }

  _transform(chunk: Uint8Array, _encoding: BufferEncoding, cb: TransformCallback) {
    if (this.isProcessing === true) logger.error('Error. This _transform function should NOT be running..');

    this.isProcessing = true;

    logger.debug('Processing: ', this.processId);
    logger.debug('Current buffer: ', this.buffer);
    logger.debug('Current chunk: ', chunk);

    this.processId++;
    this.buffer = Buffer.concat([this.buffer, chunk]);

    const cchunk = this.buffer;
    logger.debug('Concated chunk: ', cchunk);

    if (cchunk.length >= 5) {
      logger.debug('Analyzing: ', cchunk);

      const messages: IncommingMessage[] = [];

      let endOfLastMessage = -1;

      let mSrc: number;
      let mLen: number;
      let mDst: number;
      let mMsg: Buffer;
      let mCrc: number;

      for (let i = 0; i < cchunk.length - 5; i++) {
        mSrc = cchunk[i + 0];
        mLen = cchunk[i + 1];
        mDst = cchunk[i + 2];

        if (cchunk.length >= i + 2 + mLen) {
          mMsg = cchunk.slice(i + 3, i + 3 + mLen - 2);
          mCrc = cchunk[i + 2 + mLen - 1];

          let crc = 0x00;

          crc = crc ^ mSrc;
          crc = crc ^ mLen;
          crc = crc ^ mDst;

          for (let j = 0; j < mMsg.length; j++) {
            crc = crc ^ mMsg[j];
          }

          if (crc === mCrc) {
            messages.push({
              id: Date.now(),
              src: mSrc.toString(16),
              len: mLen.toString(16),
              dst: mDst.toString(16),
              msg: mMsg,
              crc: mCrc.toString(16),
            });

            endOfLastMessage = i + 2 + mLen;
            i = endOfLastMessage - 1;
          }
        }
      }

      if (messages.length) {
        messages.forEach((message) => {
          this.emit('message', message);
        });
      }

      if (endOfLastMessage !== -1) {
        this.buffer = cchunk.slice(endOfLastMessage);
        logger.debug('Sliced data: ', endOfLastMessage, this.buffer);
      } else {
        if (this.buffer.length > 500) {
          logger.warning('Dropping some data..');
          this.buffer = cchunk.slice(chunk.length - 300);
        }
      }
    }

    logger.debug('Buffered messages size: ', this.buffer.length);

    this.isProcessing = false;

    cb();
  }
}

export default IbusProtocol;
