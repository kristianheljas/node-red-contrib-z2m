/* eslint-disable camelcase */
// Some crude (incomplete!) types for Zigbee2MQTT messages to ease development

interface Z2mDeviceDefinition {
  model: string;
  vendor: string;
  description: string;
}

interface Z2mDeviceEndpoint {
  bindings: unknown[];
  configured_reportings: unknown[];
  clusters: {
    input: string[];
    output: string[];
  };
}

interface Z2mDevice {
  ieee_address: string;
  type: string;
  network_address: number;
  supported: boolean;
  friendly_name: string;
  definition: Z2mDeviceDefinition;
  power_source: string;
  software_build_id: string;
  date_code: string;
  model_id: string;
  interviewing: boolean;
  interview_completed: boolean;
  endpoints: { [id: string]: Z2mDeviceEndpoint };
}

interface Z2mBridgeInfo {
  version: string;
  commit: string;
  log_level: string;
  permit_join: boolean;
  network: {
    channel: number;
    pan_id: number;
    extended_pan_id: string;
  };
  config: {
    [key: string]: unknown;
  };
  [key: string]: unknown;
}
