import { Registrator, defaults } from '../../editor/shared/registrator';

Registrator.registerType('z2m-bridge-state', {
  paletteLabel: 'z2m state',
  icon: 'font-awesome/fa-info',
  outputs: 1,
  defaults: {
    ...defaults,
    initial: { value: true },
  },
  label() {
    return this.name || 'zigbee2qmtt state';
  },
});
