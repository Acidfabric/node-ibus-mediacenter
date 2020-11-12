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
    logger.debug(`Current buffer: ${this.buffer.toString(Encoding.Ascii)}`);
    logger.debug(`Current chunk: ${chunk.toString(Encoding.Hex)}`);

    this.processId++;
    this.buffer = Buffer.concat([this.buffer, chunk]);

    const cchunk = this.buffer;
    logger.debug(`Concated chunk: ${cchunk.toString(Encoding.Hex)}`);

    if (cchunk.length >= 5) {
      logger.debug(`Analyzing: ${cchunk.toString(Encoding.Hex)}`);

      const messages: IncommingMessage[] = [];

      let endOfLastMessage = -1;

      let packetSource: number;
      let packetLength: number;
      let packetDestination: number;
      let packaetMessage: Buffer;
      let packetChecksum: number;

      for (let i = 0; i < cchunk.length - 5; i++) {
        packetSource = cchunk[i + 0];
        packetLength = cchunk[i + 1];
        packetDestination = cchunk[i + 2];

        if (cchunk.length >= i + 2 + packetLength) {
          packaetMessage = cchunk.slice(i + 3, i + 3 + packetLength - 2);
          packetChecksum = cchunk[i + 2 + packetLength - 1];

          let crc = 0x00;

          crc = crc ^ packetSource;
          crc = crc ^ packetLength;
          crc = crc ^ packetDestination;

          for (let j = 0; j < packaetMessage.length; j++) {
            crc = crc ^ packaetMessage[j];
          }

          if (crc === packetChecksum) {
            messages.push({
              id: Date.now(),
              src: packetSource.toString(16),
              len: packetLength.toString(16),
              dst: packetDestination.toString(16),
              msg: packaetMessage,
              crc: packetChecksum.toString(16),
            });

            endOfLastMessage = i + 2 + packetLength;
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
        logger.debug(`Sliced data: ${endOfLastMessage} ${this.buffer}`);
      } else {
        if (this.buffer.length > 500) {
          logger.warning('Dropping some data..');
          this.buffer = cchunk.slice(chunk.length - 300);
        }
      }
    }

    logger.debug(`Buffered messages size: ${this.buffer.length}`);

    this.isProcessing = false;

    cb();
  }
}

export default IbusProtocol;
