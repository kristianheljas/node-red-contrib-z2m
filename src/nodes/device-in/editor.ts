import { Registrator, defaults } from '../../editor/shared/registrator';
import DeviceSelector from '../../editor/forms/device-selector';

Registrator.registerType('z2m-device-in', {
  paletteLabel: 'z2m device',
  icon: 'font-awesome/fa-sign-out',
  outputs: 1,
  defaults: {
    ...defaults,
    topic: { value: '', required: true },
    property: { value: '' },
    onlyWhenChanged: { value: false },
    sendInitialValue: { value: false },
  },
  oneditprepare() {
    const deviceSelector = new DeviceSelector(this);
    deviceSelector.attachBrokerSelect('#node-input-broker');
  },
  label() {
    if (this.name.length > 0) {
      return this.name;
    }

    let name = this.topic || 'z2m device in';

    if (this.property) {
      name = `${name} ${this.property}`;
    }

    if (this.onlyWhenChanged) {
      name = `${name} changes`;
    }

    if (this.sendInitialValue) {
      name = `* ${name}`;
    }

    return name;
  },
});
