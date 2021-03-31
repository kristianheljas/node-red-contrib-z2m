import type { NodeAPI } from 'node-red';
import { Z2mApi } from '../../api';
import { PACKAGE_NAME } from '../../core/constants';

export = (RED: NodeAPI): void => {
  if (process.env.NODE_ENV === 'development') {
    RED.comms.publish(`${PACKAGE_NAME}/core/start`, Date.now(), true);
  }
  Z2mApi.register(RED);
};
