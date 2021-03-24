import type { IPublishPacket } from 'mqtt-packet';
import type { NodeAPI } from 'node-red';
import { Z2mDeviceState } from '../../core/util';
import { Z2mNode, CheckNodeOptions, Z2mNodeDef } from '../../core/z2m-node';

interface Z2mDeviceOutNodeDef extends Z2mNodeDef {
  topic: string;
  initial: boolean;
}

@CheckNodeOptions
class Z2mDeviceOutNode extends Z2mNode<Z2mDeviceOutNodeDef> {
  static type = 'z2m-device-in';

  lastState: Z2mDeviceState = {};

  setup(): void {
    this.z2m.subscribe(this.config.topic, 0, this.onStateMessage.bind(this), this);
  }

  onStateMessage(topic: string, buffer: Buffer, { retain, qos }: IPublishPacket) {
    const state = JSON.parse(buffer.toString()) as Z2mDeviceState;

    if (retain === false || this.config.initial === true) {
      this.send({ topic, retain, qos, state, payload: state });
    }

    this.lastState = state;
  }
}

export = (RED: NodeAPI): void => {
  Z2mDeviceOutNode.register(RED);
};
