import type { NodeAPI } from 'node-red';
import Z2mBridgeStateNode from './node';

export = (RED: NodeAPI): void => {
  Z2mBridgeStateNode.register(RED);
};
