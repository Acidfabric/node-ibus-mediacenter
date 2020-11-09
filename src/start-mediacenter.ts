// import MK4ToMk3CDTextDevice from './devices/MK4ToMk3CDTextDevice';
// import GraphicsNavigationOutputDevice from './devices/GraphicsNavigationOutputDevice';
// import IbusDebuggerDevice from './devices/IbusDebuggerDevice';
// import MpdClient from './clients/MpdClient';
// import KeyboardEventListener from './listeners/KeyboardEventListener';

import { IbusEventListener } from './listeners';
import { IbusInterface } from './ibus';
import loggerSystem from './logger';
import { XbmcClient } from './clients';

const logger = loggerSystem.child({ service: 'MediaCenter' });

const device = '/dev/tty.Bluetooth-Incoming-Port'; // bluetooth

const ibusInterface = new IbusInterface(device);

process.on('SIGINT', onSignalInt);
process.on('SIGTERM', onSignalTerm);
process.on('uncaughtException', onUncaughtException);

function onSignalInt() {
  shutdown(() => {
    process.exit(1);
  });
}

function onSignalTerm() {
  logger.info('Hard exiting..');
  process.exit(1);
}

let isShuttingDown = false;

function onUncaughtException(err: Error) {
  logger.error('Caught: ', err);

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

function shutdown(successFn: () => void) {
  ibusInterface.shutdown(() => {
    successFn();
  });
}

function startup() {
  ibusInterface.startup();

  // Mpd Client
  // const mpc = new MpdClient();

  // Graphics Navidagtion Device pirate
  //var navOutput = new GraphicsNavigationOutputDevice(ibusInterface);

  // Display Mk4 CD-text as Mk3 Options
  // var mkTextBridge = new MK4ToMk3CDTextDevice(ibusInterface, navOutput);

  // Ibus debugger
  // const ibusDebuggerDevice = new IbusDebuggerDevice(ibusInterface);

  const xbmcc = new XbmcClient();

  // Keyboard Client
  // const keyboardEventListener = new KeyboardEventListener();
  // keyboardEventListener.setRemoteControlClient('xbmc', xbmcc);
  // keyboardEventListener.setRemoteControlClient('ibus', ibusDebuggerDevice);

  const ibusEventClient = new IbusEventListener(ibusInterface);
  ibusEventClient.setRemoteControlClient('xbmc', xbmcc);
}

export { startup };
