import type { NodeAPI } from 'node-red';
import Z2mBridgeLogsNode from './node';

export = (RED: NodeAPI): void => {
  Z2mBridgeLogsNode.register(RED);
};
