/* eslint-disable camelcase */
// Some crude (incomplete!) types for Zigbee2MQTT messages to ease development

declare namespace Zigbee2Mqtt {
  namespace Device {
    interface Definition {
      model: string;
      vendor: string;
      description: string;
      exposes: Zigbee2Mqtt.Expose[];
    }

    interface Endpoint {
      bindings: unknown[];
      configured_reportings: unknown[];
      clusters: {
        input: string[];
        output: string[];
      };
    }
  }

  interface Device {
    ieee_address: string;
    type: string;
    network_address: number;
    supported: boolean;
    friendly_name: string;
    definition: Device.Definition;
    power_source: string;
    software_build_id: string;
    date_code: string;
    model_id: string;
    interviewing: boolean;
    interview_completed: boolean;
    endpoints: { [id: string]: Device.Endpoint };
  }

  namespace Config {
    type LogLevel = 'debug' | 'info' | 'warn' | 'error';
    type LastSeen = 'disable' | 'ISO_8601' | 'ISO_8601_local' | 'epoch';
  }

  namespace Bridge {
    type State = 'online' | 'offline';
  }

  interface BridgeInfo {
    version: string;
    commit: string;
    log_level: Config.LogLevel;
    permit_join: boolean;
    network: {
      channel: number;
      pan_id: number;
      extended_pan_id: string;
    };
    config: {
      advanced: {
        elapsed: boolean;
        last_seen: Config.LastSeen;
        legacy_api: boolean;
        report: boolean;
      };
      permit_join: boolean;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  }
}
