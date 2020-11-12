import serialPort from 'serialport';

import loggingSystem from '../logger';

const logger = loggingSystem.child({ service: 'ListPorts' });

serialPort.list().then((ports) => {
  ports.forEach((port) => {
    logger.info(port.path);
  });
});
