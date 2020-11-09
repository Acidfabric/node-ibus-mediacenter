import cluster from 'cluster';

import * as mediaCenter from './src/start-mediacenter';
import loggerSystem from './src/logger';

const logger = loggerSystem.child({ service: 'Root' });

function onExit(worker: cluster.Worker, code: number, _signal: string) {
  if (code === 0) {
    logger.error(`Worker ${worker.id} died..`);
    cluster.fork();
  } else {
    logger.error(`Worker ${worker.id} terminated..`);
  }
}

if (cluster.isMaster) {
  cluster.fork();
  cluster.on('exit', onExit);

  logger.info('Forking process.');
} else {
  mediaCenter.startup();
}
