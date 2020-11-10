export const config = {
  // device: '/dev/tty.Bluetooth-Incoming-Port',
  device: '/dev/ttys004',
  xbmcConnection: {
    host: '127.0.0.1',
    port: 9090,
    verbose: true,
    username: 'kodi',
    password: 'kodi',
  },
  mpdConnection: {
    port: 6600,
    host: 'localhost',
  },
  iBusConnection: {
    autoOpen: false,
    baudRate: 9600,
    parity: 'even',
    stopBits: 1,
    dataBits: 8,
  },
} as const;
