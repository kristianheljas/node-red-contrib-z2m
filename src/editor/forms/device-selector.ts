import type { Z2mDevice } from '../../core/util';
import API from '../api/client';

export interface DeviceSelectorProps extends Editor.NodeProperties {
  topic: string;
  broker: string;
}

export default class DeviceSelector {
  $input: JQuery<HTMLInputElement>;

  $select: JQuery<HTMLSelectElement>;

  static create(node: Editor.NodeInstance<DeviceSelectorProps>, inputId: string): DeviceSelector {
    return new this(node, inputId);
  }

  constructor(private node: Editor.NodeInstance<DeviceSelectorProps>, inputId: string) {
    const inputSelector = `#${inputId}`;
    this.$input = $(inputSelector);

    if (this.$input.length === 0) {
      throw new Error(`Did not find any input elements for '${inputSelector}'`);
    }

    const selectSelector = `#${inputId}-selector`;
    this.$select = $(selectSelector);

    if (this.$select.length === 0) {
      throw new Error(`Did not find any select elements for '${inputSelector}'`);
    }

    this.setup();
    this.refreshDevices();
  }

  private setup() {
    const { $input, $select } = this;
    $select.on('change', () => {
      const selected = $select.val() || '';
      $input.val(selected);
    });
  }

  refreshDevices(): void {
    const { $input, $select } = this;
    const selectedTopic = $input.val() as string;

    API.getBrokerDevices(this.node.broker)
      .then((devices) => {
        $select.prop('disabled', false).selectize({
          valueField: 'topic',
          labelField: 'topic',
          options: devices,
          items: [selectedTopic],
          render: {
            item(device, escape) {
              const { topic, description } = device;
              return `<div class="item">${escape(topic)} (${escape(description)})</div>`;
            },
            option(device, escape) {
              const { topic, description } = device;
              return `<div class="option">
                <span class="title">${escape(topic)}</span>
                <span class="caption">${escape(description)}</span>
              </div>`;
            },
          },
        } as Selectize.IOptions<string, Z2mDevice>);
        return devices;
      })
      .catch((...args) => {
        console.error('Fetching devices failed', args);
      });
  }
}
