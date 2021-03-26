import type { IPublishPacket } from 'mqtt-packet';
import { Z2mDeviceState } from '../../core/util';
import { Z2mNode, CheckNodeOptions, Z2mNodeDef } from '../../core/z2m-node';

export interface Z2mDeviceOutNodeDef extends Z2mNodeDef {
  topic: string;
  property: string;
  onlyWhenChanged: boolean;
  sendInitialValue: boolean;
}

@CheckNodeOptions
export default class Z2mDeviceInNode extends Z2mNode<Z2mDeviceOutNodeDef> {
  static type = 'z2m-device-in';

  lastState: Z2mDeviceState = {};

  setup(): void {
    this.z2m.subscribe(this.config.topic, 0, this.onStateMessage.bind(this), this);
  }

  private preparePayload(state: Z2mDeviceState) {
    if (this.config.property) {
      return state[this.config.property];
    }
    return state;
  }

  private onStateMessage(topic: string, buffer: Buffer, { retain, qos }: IPublishPacket) {
    const state = JSON.parse(buffer.toString()) as Z2mDeviceState;

    const lastPayload = this.preparePayload(this.lastState);
    const payload = this.preparePayload(state);

    // Sometimes devices publish only select properites so lets skip if one wasn't provided
    // For example battery state update might not send action property
    if (payload === undefined) {
      return;
    }

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
