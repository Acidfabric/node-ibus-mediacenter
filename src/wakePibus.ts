import logger from './logger';

try {
  import('./adapters/PibusHw4Handler');
} catch (error) {
  logger.info(`Raspberry pi not found.. ${error}`);
}
