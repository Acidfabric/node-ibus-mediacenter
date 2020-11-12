import winston from 'winston';

import { parseDateTime } from '../utils';

const colorizer = winston.format.colorize();

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple(),
        winston.format.printf((msg) =>
          colorizer.colorize(
            msg.level,
            `[${msg.level} ${parseDateTime(msg.timestamp)}] ${msg.service} | ${msg.message}`,
          ),
        ),
      ),
    }),
  ],
});

export default logger;
