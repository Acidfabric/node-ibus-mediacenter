import { interfaces as itf } from './interfaces';

const messages = {
  debugger: {
    simulateRotateLeft: { src: itf.OnBoardMonitor, dst: itf.Radio, msg: Buffer.from([0x49, 0x03]) },
    simulateRotateRight: { src: itf.OnBoardMonitor, dst: itf.Radio, msg: Buffer.from([0x49, 0x83]) },
    simulateUp: { src: itf.OnBoardMonitor, dst: itf.Radio, msg: Buffer.from([0x48, 0x13]) },
    simulateDown: { src: itf.OnBoardMonitor, dst: itf.Radio, msg: Buffer.from([0x48, 0x03]) },
    simulateLeft: { src: itf.OnBoardMonitor, dst: itf.Radio, msg: Buffer.from([0x48, 0x12]) },
    simulateRight: { src: itf.OnBoardMonitor, dst: itf.Radio, msg: Buffer.from([0x48, 0x02]) },
    simulateSelect: { src: itf.OnBoardMonitor, dst: itf.Radio, msg: Buffer.from([0x48, 0x05]) },
    simulateBack: { src: itf.OnBoardMonitor, dst: itf.Radio, msg: Buffer.from([0x48, 0x01]) },
  },
  navigation: {
    updateScreen: { src: itf.Radio, dst: itf.GraphicsNavigationDriver, msg: Buffer.from([0xa5, 0x62, 0x01]) },
    refreshOptions: { src: itf.Radio, dst: itf.GraphicsNavigationDriver, msg: Buffer.from([0xa5, 0x60, 0x01, 0x00]) },
    refreshTop: { src: itf.Radio, dst: itf.GraphicsNavigationDriver, msg: Buffer.from([0xa5, 0x62, 0x01, 0x00]) },
    showStatus: { src: itf.Radio, dst: itf.GraphicsNavigationDriver, msg: Buffer.from([0xa5, 0x62, 0x01, 0x06]) },
  },
};

export { messages };
