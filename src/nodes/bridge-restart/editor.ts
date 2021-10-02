import { Registrator, defaults } from '../../editor/shared/registrator';

Registrator.registerType('z2m-bridge-restart', {
  paletteLabel: 'restart z2m',
  icon: 'font-awesome/fa-refresh',
  align: 'right',
  inputs: 1,
  defaults,
  label() {
    return this.name || 'restart zigbee2mqtt';
  },
});
