import type { Z2mDevice } from '../../core/util';
import { mirrorElementClass, onConfigChanged } from '../shared/util';
import API from '../api/client';

interface SelectDeviceOption {
  value: string;
  text: string;
  disabled?: boolean;
  device?: Z2mDevice;
}

export interface DeviceSelectorProps extends Editor.NodeProperties {
  topic: string;
  broker: string;
}

const defaultNodeSetupOptions = {
  inputSelector: '#node-input-topic',
  brokerSelector: '#node-input-broker',
};

export default class DeviceSelector {
  $input: JQuery<HTMLInputElement>;

  selectize: Selectize.IApi<string, SelectDeviceOption>;

  constructor(inputOrSelector: string | JQuery<HTMLInputElement>) {
    this.$input = typeof inputOrSelector === 'string' ? $<HTMLInputElement>(inputOrSelector) : inputOrSelector;
    this.selectize = this.setupSelectize();
  }

  private setupSelectize() {
    const { $input } = this;

    $input.selectize({
      placeholder: 'Select broker first',
      maxItems: 1,
      options: [],
      items: [],
      render: {
        item(option: SelectDeviceOption, escape) {
          if (option.device) {
            const { topic, description } = option.device;
            return `<div class="item">${escape(topic)} (${escape(description)})</div>`;
          }
          return `<div class="item">${escape(option.text)}</div>`;
        },
        option(option: SelectDeviceOption, escape) {
          if (option.device) {
            const { topic, description } = option.device;
            return `<div class="option">
              <span class="title">${escape(topic)}</span>
              <span class="caption">${escape(description)}</span>
            </div>`;
          }
          return `<div class="item">${escape(option.text)}</div>`;
        },
      },
    });

    const { selectize } = this.$input[0];

    mirrorElementClass($input[0], selectize.$control[0], 'input-error');

    return selectize;
  }

  setPlaceholder(placeholder: string): void {
    this.selectize.settings.placeholder = placeholder;
    this.selectize.updatePlaceholder();
  }

  async loadBrokerDevices(brokerId: string): Promise<void> {
    const { selectize } = this;

    const selectedValue = selectize.getValue();

    this.selectize.disable();
    this.selectize.clear();
    this.selectize.clearOptions();

    if (!brokerId || brokerId === '_ADD_') {
      this.setPlaceholder('Select broker first');
      return;
    }

    this.setPlaceholder('Loading devices...');

    selectize.load(async (setOptionsCallback) => {
      const devices = await API.getBrokerDevices(brokerId).catch((error) => {
        this.setPlaceholder(error?.message || 'Error loading devices');
        return null;
      });

      if (devices === null) return;

      const options = devices.map((device) => ({
        text: `${device.topic} (${device.description})`,
        value: device.topic,
        device,
      }));

      setOptionsCallback(options);

      selectize.setValue(selectedValue);
      selectize.enable();

      this.setPlaceholder('Select device');
    });
  }

  static setupForNode(
    node: DeviceSelectorProps,
    options: Partial<typeof defaultNodeSetupOptions> = {},
  ): DeviceSelector {
    const { inputSelector, brokerSelector } = { ...defaultNodeSetupOptions, ...options };

    const deviceSelector = new DeviceSelector(inputSelector);

    if (node.broker) {
      deviceSelector.loadBrokerDevices(node.broker);
    }

    onConfigChanged(brokerSelector, (brokerId) => {
      deviceSelector.loadBrokerDevices(brokerId);
    });

    return deviceSelector;
  }
}
