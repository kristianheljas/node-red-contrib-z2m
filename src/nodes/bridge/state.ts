import type { IPublishPacket } from 'mqtt';
import type { NodeAPI } from 'node-red';
import { Z2mNode, Z2mNodeDef } from '../../core/z2m-node';

interface Z2mBridgeStateNodeDef extends Z2mNodeDef {
  initial: boolean;
}

class Z2mBridgeStateNode extends Z2mNode<Z2mBridgeStateNodeDef> {
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
  Z2mBridgeStateNode.register(RED, 'z2m-bridge-state');
};
