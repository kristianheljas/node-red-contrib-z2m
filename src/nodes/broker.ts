import type { NodeAPI } from 'node-red';
import { Z2mBrokerNode } from '../core/z2m-broker';

export = (RED: NodeAPI): void => {
  Z2mBrokerNode.register(RED);
};
