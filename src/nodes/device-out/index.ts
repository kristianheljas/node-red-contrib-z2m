import type { NodeAPI } from 'node-red';
import Z2mDeviceOutNode from './node';

export = (RED: NodeAPI): void => {
  Z2mDeviceOutNode.register(RED);
};
