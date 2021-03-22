import type { NodeAPI } from 'node-red';
import { Z2mNode } from '../../core/z2m-node';

class Z2mBridgeRestartNode extends Z2mNode {
  setup(): void {
    this.on('input', () => {
      this.z2m.restart();
      this.status({
        shape: 'ring',
        fill: 'yellow',
        text: 'restart requested',
      });
    });
  }
}

export = (RED: NodeAPI): void => {
  Z2mBridgeRestartNode.register(RED, 'z2m-bridge-restart');
};
