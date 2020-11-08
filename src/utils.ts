export function compareify(src: string, dst: string, msg: Buffer) {
  return Buffer.concat([Buffer.from([parseInt(src, 16), parseInt(dst, 16)]), msg]);
}

export function isEq(op1: Buffer, op2: Buffer) {
  return op1.equals(op2);
}

export function repeat(callback: () => void, times: number) {
  for (let i = 0; i < times; i++) {
    callback();
  }
}

export function getPaddedLenBuf(text: string, len: number) {
  const outputTextBuf = Buffer.alloc(len);
  outputTextBuf.fill(0x20);

  const textBuf = Buffer.from(text, 'utf-8').slice(0, len);
  textBuf.copy(outputTextBuf);

  return outputTextBuf;
}

export function getHrDiffTime(time: [number, number]) {
  const ts = process.hrtime(time);
  return ts[0] * 1000 + ts[1] / 1000000;
}
