export type Z2mBridgeState = 'online' | 'offline';

export interface Z2mBridgeInfo {
  version?: string;
  logLevel?: Zigbee2MqttBridgeLogLevel;
  permitJoin?: boolean;
  config?: {
    elapsed: boolean;
    lastSeen: Zigbee2MqttBridgeLastSeen;
  };
}

export interface Z2mDevice {
  topic: string;
  address: string;
  model: string;
  vendor: string;
  description: string;
  helpUrl: string;
}

export interface Z2mDeviceState {
  [key: string]: unknown;
}

export class Z2mUtil {
  static getDeviceModelHelpUrl(model: string): string {
    // https://github.com/Koenkk/zigbee2mqtt.io/blob/master/docgen/utils.js#L13
    return `https://www.zigbee2mqtt.io/devices/${model.replace(/[/| |:]/g, '_')}.html`;
  }

  static deviceSupported({ supported, interview_completed }: Zigbee2MqttDevice): boolean {
    return supported && interview_completed;
  }

  static parseDevice(device: Zigbee2MqttDevice): Z2mDevice {
    const { friendly_name: topic, ieee_address: address, definition } = device;
    const { vendor, model, description } = definition;
    const helpUrl = Z2mUtil.getDeviceModelHelpUrl(model);

    return {
      topic,
      address,
      model,
      vendor,
      description,
      helpUrl,
    };
  }

  static parseBridgeInfo(info: Zigbee2MqttBridgeInfo): Z2mBridgeInfo {
    const { version, log_level: logLevel, permit_join: permitJoin, config } = info;
    const { elapsed, last_seen: lastSeen } = config.advanced;

    return {
      version,
      logLevel,
      permitJoin,
      config: {
        elapsed,
        lastSeen,
      },
    };
  }
}

export default Z2mUtil;
