export interface OutgoingMessage {
  src: number;
  dst: number;
  msg: Buffer;
}

export interface IncommingMessage {
  id: number;
  src: string;
  len: string;
  dst: string;
  msg: Buffer;
  crc: string;
}
