import logger from './logger';

abstract class Base {
  protected logger: typeof logger;

  constructor(name: string) {
    this.logger = logger.child({ service: name });
  }
}

export { Base };
