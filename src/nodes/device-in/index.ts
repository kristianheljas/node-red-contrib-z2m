import type { NodeAPI } from 'node-red';
import Z2mDeviceInNode from './node';

export = (RED: NodeAPI): void => {
  Z2mDeviceInNode.register(RED);
};
