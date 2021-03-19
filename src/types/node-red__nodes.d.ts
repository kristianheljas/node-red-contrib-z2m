declare module '@node-red/nodes/core/network/10-mqtt' {
  import type { Node } from 'node-red';
  import type { MqttClient, QoS, IPublishPacket } from 'mqtt';

  export type SubscriptionCallback = (topic: string, buffer: Buffer, packet: IPublishPacket) => void;

  export type Ref = number | string;

  export interface MQTTMessage {
    topic: string;
    qos?: QoS;
    retain?: boolean;
    payload?: unknown;
  }

  export interface MQTTBrokerNode extends Node {
    client: MqttClient;
    credentials: { user: string; password: string };
    broker: string;
    port: string;
    clientid: string;
    usetls: boolean;
    usews: boolean;
    verifyservercert: boolean;
    compatmode: boolean;
    keepalive: number;
    cleansession: boolean;
    brokerurl: string;
    connected: boolean;
    connecting: boolean;
    closing: boolean;
    options: {
      clientId: string;
      username: string;
      password: string;
      keepalive: number;
      clean: boolean;
      reconnectPeriod: number;
      rejectUnauthorized: boolean;
    };
    queue: [];
    subscriptions: {
      [topic: string]: {
        [ref: string]: unknown;
      };
    };
    username: string;
    password: string;
    users: {
      [id: string]: Node;
    };

    register: (node: Node) => void;

    deregister: (node: Node, done: () => void) => void;

    connect: () => void;

    subscribe: (topic: string, qos: QoS, callback: SubscriptionCallback, ref?: Ref) => void;

    unsubscribe: (topic: string, ref?: Ref, removed?: boolean) => void;

    publish: (message: MQTTMessage, done?: () => void) => void;
  }
}
