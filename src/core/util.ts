/// <reference types="../types/zigbee2mqtt" />

export enum FeatureAccess {
  // Access bitmask
  STATE = 0b001, // Available in the state object
  SET = 0b010, // Can be set
  GET = 0b100, // Can be get
  // Combined masks
  STATE_SET = 0b011,
  STATE_GET = 0b101,
  ALL = 0b111,
}

export type Z2mBridgeState = 'online' | 'offline';

export type Z2mDeviceFeatures = Record<string, Zigbee2Mqtt.Feature>;

export interface Z2mBridgeInfo {
  version?: string;
  logLevel?: Zigbee2Mqtt.Config.LogLevel;
  permitJoin?: boolean;
  config?: {
    elapsed: boolean;
    lastSeen: Zigbee2Mqtt.Config.LastSeen;
  };
}

export interface Z2mDevice {
  topic: string;
  address: string;
  model: string;
  vendor: string;
  description: string;
  helpUrl: string;
  inputs: string[];
  outputs: string[];
  features: Z2mDeviceFeatures;
}

export interface Z2mDeviceState {
  [key: string]: unknown;
}

export class Z2mUtil {
  static getDeviceModelHelpUrl(model: string): string {
    // https://github.com/Koenkk/zigbee2mqtt.io/blob/master/docgen/utils.js#L13
    return `https://www.zigbee2mqtt.io/devices/${model.replace(/[/| |:]/g, '_')}.html`;
  }

  static deviceSupported({ supported, interview_completed }: Zigbee2Mqtt.Device): boolean {
    return supported && interview_completed;
  }

  static parseDevice(device: Zigbee2Mqtt.Device): Z2mDevice {
    const { friendly_name: topic, ieee_address: address, definition } = device;
    const { vendor, model, description, exposes } = definition;
    const helpUrl = Z2mUtil.getDeviceModelHelpUrl(model);

    const features = Z2mUtil.flattenExposeToFeatures(exposes);

    const inputs = Object.values(features)
      .filter((feature) => Z2mUtil.featureHasAccess(feature, FeatureAccess.STATE))
      .map((feature) => feature.property);

    const outputs = Object.values(features)
      .filter((feature) => Z2mUtil.featureHasAccess(feature, FeatureAccess.SET))
      .map((feature) => feature.property);

    return {
      topic,
      address,
      model,
      vendor,
      description,
      helpUrl,
      inputs,
      outputs,
      features,
    };
  }

  static featureHasAccess(feature: Zigbee2Mqtt.Feature, requiredAccess: number): number {
    /* eslint-disable no-bitwise */
    const maximumFeatureAccess =
      feature.type === 'composite'
        ? feature.features.reduce((totalAccess, { access }) => totalAccess | access, 0)
        : feature.access;

    return maximumFeatureAccess & requiredAccess;
    /* eslint-enable no-bitwise */
  }

  static exposeHasFeatures(expose: Zigbee2Mqtt.Expose): expose is Zigbee2Mqtt.ExposeWithFeatures {
    return Object.prototype.hasOwnProperty.call(expose, 'features');
  }

  static flattenExposeToFeatures(exposes: Zigbee2Mqtt.Expose[]): Z2mDeviceFeatures {
    return exposes.reduce<Z2mDeviceFeatures>((features, expose) => {
      /* eslint-disable no-param-reassign */
      if (expose.type !== 'composite' && Z2mUtil.exposeHasFeatures(expose)) {
        features = { ...features, ...Z2mUtil.flattenExposeToFeatures(expose.features) };
      } else {
        // TODO: There are some devices with duplicate properties
        // for example some lights expose color_xy and color_hs
        // both as "color" with different composite values
        // but some are actually duplicates like "local_temperature"
        features[expose.property] = expose;
      }
      /* eslint-enable no-param-reassign */
      return features;
    }, {});
  }

  static parseBridgeInfo(info: Zigbee2Mqtt.BridgeInfo): Z2mBridgeInfo {
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
