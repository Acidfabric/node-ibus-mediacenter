// import cluster from 'cluster';
// import MK4ToMk3CDTextDevice from './devices/MK4ToMk3CDTextDevice';
// import GraphicsNavigationOutputDevice from './devices/GraphicsNavigationOutputDevice';
// import IbusDebuggerDevice from './devices/IbusDebuggerDevice';
// import MpdClient from './clients/MpdClient';
// import KeyboardEventListener from './listeners/KeyboardEventListener';
// import { IbusInterface } from 'ibus';

import { IbusInterface } from './ibus';
import loggerSystem from './logger';
import XbmcClient from './clients/XbmcClient';
import IbusEventClient from './listeners/IbusEventListener';

const logger = loggerSystem.child({ service: 'MediaCenter' });

// if (cluster.isMaster) {
//   cluster.fork();

//   cluster.on('exit', (worker, code, _signal) => {
//     if (code === 0) {
//       log.error('Worker ' + worker.id + ' died..');
//       cluster.fork();
//     } else {
//       log.error('Worker ' + worker.id + ' terminated..');
//     }
//   });
// } else {

// config
// const device = '/dev/ttys003';
// var device = '/dev/ttyUSB0';
// const device = '/dev/cu.usbserial-A601HPGR';
const device = '/dev/ttyAMA0'; // bluetooth

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

export function startup() {
  ibusInterface.startup();

  // Mpd Client
  //var mpc = new MpdClient();

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

  const ibusEventClient = new IbusEventClient(ibusInterface);
  ibusEventClient.setRemoteControlClient('xbmc', xbmcc);
}
