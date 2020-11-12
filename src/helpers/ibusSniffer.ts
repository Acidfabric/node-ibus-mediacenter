import fs from 'fs';
import path from 'path';
import serialPort from 'serialport';

import { config } from '../constants';
import { getDateTimeNow } from '../utils';
import loggingSystem from '../logger';

const logger = loggingSystem.child({ service: 'Sniffer' });

const dir = path.normalize(path.join(__dirname, `../../${config.rawDirectory}`));

if (!fs.existsSync(dir)) {
  logger.info(`Creating directory: ${dir}`);
  fs.mkdirSync(dir, { recursive: true });
}

const wstream = fs.createWriteStream(`${dir}/${getDateTimeNow()}.bin`);
const port = new serialPort(config.device, config.iBusConnection);

port.open((error) => {
  if (error) {
    logger.error(`failed to open: ${error}`);
    return;
  }

  logger.info('open');
  port.on('data', (data) => {
    logger.info(data.toString('hex'));
    wstream.write(data);
  });
});

process.on('SIGINT', () => {
  logger.info('Gracefully shutting down from SIGINT (Ctrl-C)');
  wstream.end();
  process.exit();
});
