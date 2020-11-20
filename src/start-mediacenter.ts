import os from 'os';

import { GraphicsNavigationOutputDevice, MK4ToMk3CDTextDevice } from './devices';
import { IbusEventListener, KeyboardEventListener } from './listeners';
import { BluetoothClient } from './clients';
import { IbusInterface } from './ibus';
import loggerSystem from './logger';

const logger = loggerSystem.child({ service: 'MediaCenter' });

function onSignalInt() {
  shutdown(() => {
    logger.info('Gracefully shutting down from SIGINT (Ctrl-C)');
    process.exit(1);
  });
}

function onSignalTerm() {
  logger.info('Hard exiting..');
  process.exit(1);
}

let isShuttingDown = false;

function onUncaughtException(err: Error) {
  logger.error(`Caught: ${err}`);

  if (isShuttingDown) {
    logger.info('Waiting for previous restart..');
    return;
  }

  logger.info('Exiting app in 5 seconds...');

  isShuttingDown = true;

  setTimeout(() => {
    shutdown(() => {
      logger.info('Shutdown success..');
      process.exit();
    });
  }, 5000);
}

process.on('SIGINT', onSignalInt);
process.on('SIGTERM', onSignalTerm);
process.on('uncaughtException', onUncaughtException);

const ibusInterface = new IbusInterface();

function shutdown(successFn: () => void) {
  ibusInterface.shutdown(() => {
    successFn();
  });
}

function startup() {
  ibusInterface.startup();
  // const ibusReader = new IbusReader(ibusInterface);

  const navOutput = new GraphicsNavigationOutputDevice(ibusInterface);
  new MK4ToMk3CDTextDevice(ibusInterface, navOutput);

  // DBUS only works on Linux syste,
  const osType = os.type();
  if (osType.toLowerCase() === 'linux') {
    const bluetoothDevice = new BluetoothClient(navOutput);
    // const ibusDebuggerDevice = new IbusDebuggerDevice(ibusInterface);
    // new KeyboardEventListener('ibus', ibusDebuggerDevice);
    new KeyboardEventListener('phone', bluetoothDevice);

    const ibusEventClient = new IbusEventListener(ibusInterface);
    ibusEventClient.setRemoteControlClient('phone', bluetoothDevice);
  }
}

export { startup };
