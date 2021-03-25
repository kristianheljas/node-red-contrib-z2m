import { Registrator, defaults } from '../../editor/registrator';

Registrator.registerType('z2m-device-out', {
  paletteLabel: 'z2m device',
  icon: 'font-awesome/fa-sign-out',
  align: 'right',
  inputs: 1,
  defaults: {
    ...defaults,
    topic: { value: '', required: true },
  },
  label() {
    return this.name || this.topic || 'z2m device out';
  },
});
