/* eslint-disable camelcase */
// Some crude (incomplete!) types for Zigbee2MQTT messages to ease development

interface Zigbee2MqttDeviceDefinition {
  model: string;
  vendor: string;
  description: string;
}

interface Zigbee2MqttDeviceEndpoint {
  bindings: unknown[];
  configured_reportings: unknown[];
  clusters: {
    input: string[];
    output: string[];
  };
}

interface Zigbee2MqttDevice {
  ieee_address: string;
  type: string;
  network_address: number;
  supported: boolean;
  friendly_name: string;
  definition: Zigbee2MqttDeviceDefinition;
  power_source: string;
  software_build_id: string;
  date_code: string;
  model_id: string;
  interviewing: boolean;
  interview_completed: boolean;
  endpoints: { [id: string]: Zigbee2MqttDeviceEndpoint };
}

type Zigbee2MqtttBridgeState = 'online' | 'offline';
type Zigbee2MqttBridgeLogLevel = 'debug' | 'info' | 'warn' | 'error';
type Zigbee2MqttBridgeLastSeen = 'disable' | 'ISO_8601' | 'ISO_8601_local' | 'epoch';

interface Zigbee2MqttBridgeInfo {
  version: string;
  commit: string;
  log_level: Zigbee2MqttBridgeLogLevel;
  permit_join: boolean;
  network: {
    channel: number;
    pan_id: number;
    extended_pan_id: string;
  };
  config: {
    advanced: {
      elapsed: boolean;
      last_seen: Zigbee2MqttBridgeLastSeen;
      legacy_api: boolean;
      report: boolean;
    };
    permit_join: boolean;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}
