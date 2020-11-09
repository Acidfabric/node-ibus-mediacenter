export function isEq(op1: Buffer, op2: Buffer) {
  return op1.equals(op2);
}

export function repeat(callback: () => void, times: number) {
  for (let i = 0; i < times; i++) {
    callback();
  }
}
