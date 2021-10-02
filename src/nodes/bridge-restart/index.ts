import type { NodeAPI } from 'node-red';
import Z2mBridgeRestartNode from './node';

export = (RED: NodeAPI): void => {
  Z2mBridgeRestartNode.register(RED);
};
