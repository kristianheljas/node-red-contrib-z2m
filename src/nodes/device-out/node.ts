import { Z2mDeviceState } from '../../core/util';
import { Z2mNode, CheckNodeOptions, Z2mNodeDef } from '../../core/z2m-node';

export interface Z2mDeviceOutNodeDef extends Z2mNodeDef {
  topic: string;
  initial: boolean;
}

@CheckNodeOptions
export default class Z2mDeviceOutNode extends Z2mNode<Z2mDeviceOutNodeDef> {
  static type = 'z2m-device-out';

  lastState: Z2mDeviceState = {};

  setup(): void {
    this.on('input', (message) => {
      let payload = message.payload as Z2mDeviceState;

      // Allow inputs like 'on', 'off' and 'toggle'
      if (typeof payload === 'string') {
        payload = { state: payload };
      }

      this.sendState(payload as Z2mDeviceState);
    });
  }

  private sendState(state: Z2mDeviceState) {
    this.z2m.publish(`${this.config.topic}/set`, state);
  }
}
