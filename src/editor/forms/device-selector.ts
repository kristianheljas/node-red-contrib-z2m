import type { Z2mDevice } from '../../core/util';
import API from '../api/client';
import { mirrorElementClass } from '../shared/util';

type TemplateItem = Select2.IdTextPair | Select2.LoadingData | Select2.DataFormat | Select2.GroupedDataFormat;

export interface DeviceSelectorProps extends Editor.NodeProperties {
  topic: string;
  broker: string;
}

export default class DeviceSelector {
  $input: JQuery<HTMLInputElement>;

  $select!: JQuery<HTMLSelectElement>;

  $caption!: JQuery<HTMLSpanElement>;

  select2!: Select2.Select2 & {
    dataAdapter: Select2.ArrayAdapter;
  };

  devices: Z2mDevice[] = [];

  constructor(node: DeviceSelectorProps, inputSelector = '#node-input-topic') {
    this.$input = $(inputSelector);

    this.setup();

    if (node.broker) {
      this.setBroker(node.broker);
    }
  }

  private setup() {
    const { $input } = this;

    // Create new elements
    const $select = $<HTMLSelectElement>('<select disabled="disabled">');
    const $help = $('<span class="help-block">');

    $select.on('change', () => {
      const selectedValue = ($select.val() as string) || '';
      this.setDevice(selectedValue);
      $input.val(selectedValue);
    });

    $input.on('change', () => {
      this.setDevice(($input.val() as string) || '');
    });

    // We optionally add default options before loading any data
    const data: Select2.DataFormat[] = [];

    // If the input has a value, it should be available in case data loading fails
    const inputValue = ($input.val() as string) || '';
    if (inputValue.length) {
      data.push({
        id: inputValue,
        text: inputValue,
        selected: true,
      });
    }

    // Visually replace the input element
    $input.hide().after($select, $help);

    // And then initialize select2
    const select2 = $select
      .select2({
        placeholder: 'Select device...',
        templateSelection: this.fromatSelection.bind(this),
        templateResult: this.formatResult.bind(this),
        data,
      })
      .data('select2');

    // Node-RED is already validating the input
    // Let's indicate tehese errors on select2
    mirrorElementClass($input[0], select2.$selection[0], 'input-error');

    // Make the elements available
    this.$select = $select;
    this.select2 = select2 as typeof select2 & {
      dataAdapter: Select2.ArrayAdapter;
    };
    this.$caption = $help;
  }

  disable(): void {
    this.$select.prop('disabled', true);
  }

  enable(): void {
    this.$select.prop('disabled', false);
  }

  attachBrokerSelect(selector: string): void {
    let lastBrokerId: string;
    $<HTMLSelectElement>(selector).on('change', (event) => {
      const brokerId = event.target.value;
      if (lastBrokerId && lastBrokerId !== brokerId) {
        if (brokerId === '_ADD_' || brokerId === '') {
          this.disable();
          this.setCaption('Please select broker first', 'warning');
        } else {
          this.setBroker(brokerId);
        }
      }
      lastBrokerId = brokerId;
    });
  }

  async setBroker(brokerId: string): Promise<void> {
    this.setCaption('Loading devices...', 'info');
    this.disable();

    // Fetch devices via API or show error message
    const devices = await API.getBrokerDevices(brokerId).catch((error) => {
      this.setCaption(error?.message || 'Device list loading failed', 'error');
      return null;
    });

    this.devices = devices ?? [];

    if (devices === null) return;

    const options: Select2.AnyDataArray = devices.map((device) => ({
      id: device.topic,
      text: device.topic,
    }));

    this.updateOptions(options);

    this.enable();
  }

  private findDevice(id: number | string | undefined): Z2mDevice | null {
    if (id) {
      return this.devices.find((_device) => _device.topic === id) || null;
    }
    return null;
  }

  private fromatSelection(item: TemplateItem) {
    const $template = $(`<span>${item.text}</span>`);

    const device = this.findDevice(item.id);
    if (device) {
      $template.append(`<span class="subtext muted"> ${device.vendor} ${device.model}</span>`);
    } else {
      $template.append(`<span class="subtext text-warning"> Device not found</span>`);
    }

    return $template;
  }

  private formatResult(item: TemplateItem) {
    const $template = this.fromatSelection(item);

    const device = this.findDevice(item.id);
    if (device && device.description) {
      $template.append(`<div class="caption muted">${device.description}</div>`);
    }

    return $template;
  }

  private setDevice(id: number | string | undefined) {
    if (id) {
      const { $select } = this;

      // Ensure we always have desired option available
      if (this.hasOption(id) === false) {
        this.addOptions([{ id, text: id?.toString() }]);
      }
      $select.val(id).trigger('change.select2');

      const device = this.findDevice(id);
      if (device === null) {
        this.clearCaption();
        return;
      }

      this.setCaption(
        `<a href="${device.helpUrl}" target="_blank">Zigbee2MQTT device docs <i class="fa fa-external-link"></i></a>`,
      );
    } else {
      this.clearCaption();
    }
  }

  setCaption(message: string, messageType: 'error' | 'warning' | 'info' | 'success' | 'default' = 'default'): void {
    const icons: { [key in typeof messageType]: string | false } = {
      default: false,
      error: 'exclamation',
      warning: 'exclamation',
      info: 'info',
      success: 'check',
    };

    let messageHtml = message;

    if (messageType !== 'default') {
      if (icons[messageType]) {
        messageHtml = `<i class="fa fa-${icons[messageType]}"></i> ${messageHtml}`;
      }
      messageHtml = `<span class="text-${messageType}">${messageHtml}</span>`;
    }

    this.$caption.html(messageHtml);
  }

  clearCaption(): void {
    this.setCaption('');
  }

  clear(): void {
    this.select2.$element.find('option').remove();
  }

  private hasOption(id: string | number): boolean {
    const { $select } = this;
    const options = $select.find('option').get();

    return options.some((option) => option.value === id.toString());
  }

  private addOptions(data: Select2.AnyDataArray) {
    const { select2 } = this;

    // Overwrite options using ArrayAdapter internals
    const options = select2.dataAdapter.convertToOptions(data);
    select2.dataAdapter.addOptions(options);
  }

  private updateOptions(data: Select2.AnyDataArray): void {
    const { $select } = this;

    // Remember selected value
    const selectedValue = ($select.val() as string) || '';

    this.clear();
    this.addOptions(data);
    this.setDevice(selectedValue);
  }
}
