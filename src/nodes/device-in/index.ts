import type { IPublishPacket } from 'mqtt-packet';
import type { NodeAPI } from 'node-red';
import { Z2mDeviceState } from '../../core/util';
import { Z2mNode, CheckNodeOptions, Z2mNodeDef } from '../../core/z2m-node';

interface Z2mDeviceOutNodeDef extends Z2mNodeDef {
  topic: string;
  property: string;
  onlyWhenChanged: boolean;
  sendInitialValue: boolean;
}

@CheckNodeOptions
class Z2mDeviceInNode extends Z2mNode<Z2mDeviceOutNodeDef> {
  static type = 'z2m-device-in';

  lastState: Z2mDeviceState = {};

  setup(): void {
    this.z2m.subscribe(this.config.topic, 0, this.onStateMessage.bind(this), this);
  }

  preparePayload(state: Z2mDeviceState) {
    if (this.config.property) {
      return state[this.config.property] ?? null;
    }
    return state;
  }

  onStateMessage(topic: string, buffer: Buffer, { retain, qos }: IPublishPacket) {
    const state = JSON.parse(buffer.toString()) as Z2mDeviceState;

    const lastPayload = this.preparePayload(this.lastState);
    const payload = this.preparePayload(state);

    let shouldSend = true;

    if (this.config.onlyWhenChanged && payload === lastPayload) {
      shouldSend = false;
    }

    if (this.config.sendInitialValue === false && retain === true) {
      shouldSend = false;
    }

    if (shouldSend) {
      this.send({ topic, retain, qos, state, payload });
    }

    this.lastState = state;
  }
}

export = (RED: NodeAPI): void => {
  Z2mDeviceInNode.register(RED);
};
