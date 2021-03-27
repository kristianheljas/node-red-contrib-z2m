import DeviceSelector from '../../editor/forms/device-selector';
import { defaults, Registrator } from '../../editor/shared/registrator';

Registrator.registerType('z2m-device-out', {
  paletteLabel: 'z2m device',
  icon: 'font-awesome/fa-sign-out',
  align: 'right',
  inputs: 1,
  defaults: {
    ...defaults,
    topic: { value: '', required: true },
  },
  oneditprepare() {
    DeviceSelector.create(this, 'node-input-topic');
  },
  label() {
    return this.name || this.topic || 'z2m device out';
  },
});
