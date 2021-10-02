import { Registrator, defaults } from '../../editor/shared/registrator';

Registrator.registerType('z2m-bridge-logs', {
  paletteLabel: 'z2m logs',
  icon: 'font-awesome/fa-file-text',
  outputs: 1,
  defaults: {
    ...defaults,
    level: { value: 'error' },
  },
  label() {
    return this.name || 'zigbee2mqtt logs';
  },
});
