import { Encoding } from '../constants';
import { OutgoingMessage } from '../ibus';

export function getPaddedLenBuf(text: string, len: number) {
  const outputTextBuf = Buffer.alloc(len);
  outputTextBuf.fill(0x20);

  const textBuf = Buffer.from(text, Encoding.Utf8).slice(0, len);
  textBuf.copy(outputTextBuf);

  return outputTextBuf;
}

export function compareify(src: string, dst: string, msg: Buffer) {
  return Buffer.concat([Buffer.from([parseInt(src, 16), parseInt(dst, 16)]), msg]);
}

export function createIbusMessage(msg: OutgoingMessage) {
  const packetLength = 4 + msg.msg.length;
  const buf = Buffer.alloc(packetLength);

  buf[0] = msg.src;
  buf[1] = msg.msg.length + 2;
  buf[2] = msg.dst;

  for (let i = 0; i < msg.msg.length; i++) {
    buf[3 + i] = msg.msg[i];
  }

  let crc = 0x00;
  for (let i = 0; i < buf.length - 1; i++) {
    crc ^= buf[i];
  }

  buf[3 + msg.msg.length] = crc;

  return buf;
}
