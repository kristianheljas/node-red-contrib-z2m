import type { NodeAPI } from 'node-red';
import { Z2mApi } from '../api';

export = (RED: NodeAPI): void => {
  Z2mApi.register(RED);
};
