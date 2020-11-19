import { Transform, TransformCallback, TransformOptions } from 'stream';
import autoBind from 'auto-bind';

import { Encoding } from '../constants';
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

  _transform(chunk: Buffer, _encoding: BufferEncoding, cb: TransformCallback) {
    if (this.isProcessing === true) logger.error('Error. This _transform function should NOT be running..');

    this.isProcessing = true;

    logger.debug(`Processing: ${this.processId}`);
    logger.debug(`Current buffer: ${this.buffer.toString(Encoding.Hex)}`);
    logger.debug(`Current chunk: ${chunk.toString(Encoding.Hex)}`);

    this.processId++;
    this.buffer = Buffer.concat([this.buffer, chunk]);
    logger.debug(`Buffer concatinated with chunk: ${this.buffer.toString(Encoding.Hex)}`);

    const copyChunk = this.buffer;

    if (copyChunk.length >= 5) {
      const messages: IncommingMessage[] = [];

      let endOfLastMessage = -1;

      for (let i = 0; i < copyChunk.length - 5; i++) {
        const packetSource = copyChunk[i];
        const packetLength = copyChunk[i + 1];
        const packetDestination = copyChunk[i + 2];
        const packetMessage = copyChunk.slice(i + 3, i + 3 + packetLength - 2);
        const lastChunkItem = i + 2 + packetLength;
        const packetChecksum = copyChunk[lastChunkItem - 1];
        let crc = 0x00;

        if (copyChunk.length >= lastChunkItem) {
          crc = crc ^ packetSource;
          crc = crc ^ packetLength;
          crc = crc ^ packetDestination;

          for (let j = 0; j < packetMessage.length; j++) {
            crc = crc ^ packetMessage[j];
          }

          if (crc === packetChecksum) {
            messages.push({
              id: Date.now(),
              src: packetSource.toString(16),
              len: packetLength.toString(16),
              dst: packetDestination.toString(16),
              msg: packetMessage,
              crc: packetChecksum.toString(16),
            });

            endOfLastMessage = lastChunkItem;
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
        this.buffer = copyChunk.slice(endOfLastMessage);
        logger.debug(`Sliced data: ${endOfLastMessage} ${this.buffer}`);
      } else {
        if (this.buffer.length > 500) {
          logger.warning('Dropping some data..');
          this.buffer = copyChunk.slice(chunk.length - 300);
        }
      }
    }

    logger.debug(`Buffered messages size: ${this.buffer.length}`);

    this.isProcessing = false;

    cb();
  }
}

export default IbusProtocol;
