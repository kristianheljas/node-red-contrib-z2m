import type { NodeAPI } from 'node-red';
import Z2mBrokerNode from './node';

export = (RED: NodeAPI): void => {
  Z2mBrokerNode.register(RED);
};
