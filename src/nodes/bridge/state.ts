import type { IPublishPacket } from 'mqtt';
import type { NodeAPI } from 'node-red';
import { Z2mNode, Z2mNodeDef, CheckNodeOptions } from '../../core/z2m-node';

interface Z2mBridgeStateNodeDef extends Z2mNodeDef {
  initial: boolean;
}

@CheckNodeOptions
class Z2mBridgeStateNode extends Z2mNode<Z2mBridgeStateNodeDef> {
  static type = 'z2m-bridge-state';

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
  Z2mBridgeStateNode.register(RED);
};
