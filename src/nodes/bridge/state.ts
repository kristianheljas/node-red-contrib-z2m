import type { IPublishPacket } from 'mqtt';
import type { NodeAPI } from 'node-red';
import { Z2mNode } from '../../core/z2m-node';

interface BridgeStateConfig {
  initial: boolean;
}

class BridgeStateNode extends Z2mNode<BridgeStateConfig> {
  setup(): void {
    this.z2m.subscribe('bridge/state', 1, this.onStateMessage.bind(this), this);
  }

  onStateMessage(topic: string, buffer: Buffer, { retain }: IPublishPacket) {
    if (!retain || this.config.initial) {
      const payload = buffer.toString();
      this.send({ topic, payload, retain });
    }
  }
}

export = (RED: NodeAPI): void => {
  BridgeStateNode.register(RED, 'z2m-bridge-state');
};
