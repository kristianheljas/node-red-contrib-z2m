import { Registrator, defaults } from '../../editor/registrator';
import DeviceSelector from '../../editor/forms/device-selector';

// eslint-disable-next-line promise/catch-or-return
$.when($.ready).then(() => {
  const node = RED.nodes.node('25f4695.b4ef496');
  // eslint-disable-next-line promise/always-return
  if (node) {
    RED.editor.edit(node);
  }
});

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
    DeviceSelector.create(this, 'node-input-topic');
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
