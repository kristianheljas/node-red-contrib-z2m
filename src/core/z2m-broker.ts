// eslint-disable-next-line node/no-extraneous-import
import type { MQTTBrokerNode, MQTTMessage, SubscriptionCallback } from '@node-red/nodes/core/network/10-mqtt';
import type { IPublishPacket, QoS } from 'mqtt';
import type { NodeDef, NodeStatus, NodeStatusFill } from 'node-red';
import { Node } from './node';

type BridgeState = 'online' | 'offline';

interface Bridge {
  state: BridgeState;
  info: Z2mBridgeInfo | null;
  devices: Z2mDevice[];
}

interface SubscriptionRegistry {
  [ref: string]: {
    node: Node;
    topics: {
      [topic: string]: {
        qos: QoS;
      };
    };
  };
}

export { SubscriptionCallback };

export type BrokerState = 'disconnected' | 'connecting' | 'offline' | 'online';

export interface BrokerConfig {
  broker: string;
  topic: string;
}

export class Z2mBrokerNode extends Node<BrokerConfig> {
  private mqtt: MQTTBrokerNode;

  configured = false;

  restarting = false;

  subscriptions: SubscriptionRegistry = {};

  state: BrokerState = 'disconnected';

  bridge: Bridge = {
    state: 'offline',
    info: null,
    devices: [],
  };

  devices: Z2mDevice[] = [];

  constructor(config: NodeDef & BrokerConfig) {
    super(config);
    this.mqtt = this.red.nodes.getNode(this.config.broker) as MQTTBrokerNode;

    if (this.mqtt) {
      // Setup MQTT brodker node
      this.setupMqtt();

      // Let's keep track of our own subscriptions as well
      this.register(this);

      // Handle necessary Zigbee2MQTT bridge messages
      this.subscribe('bridge/state', 1, this.handleBridgeMessage.bind(this), this);
      this.subscribe('bridge/info', 1, this.handleBridgeMessage.bind(this), this);
      this.subscribe('bridge/devices', 1, this.handleBridgeMessage.bind(this), this);

      this.configured = true;
    } else {
      this.error('missing or disabled mqtt-broker configuration');
    }
  }

  publish(z2mTopic: string, payload?: unknown, options?: Exclude<MQTTMessage, 'topic' | 'payload'>): void {
    const topic = z2mTopic.startsWith('/') ? z2mTopic.substr(1) : `${this.config.topic}/${z2mTopic}`;
    this.mqtt.publish({
      ...options,
      topic,
      payload,
    });
  }

  subscribe(z2mTopic: string, qos: QoS, callback: SubscriptionCallback, node: Node): void {
    const topic = z2mTopic.startsWith('/') ? z2mTopic.substr(1) : `${this.config.topic}/${z2mTopic}`;

    if (!this.subscriptions[node.id]) {
      node.error(`${node.id} is not registered, forgot to call Z2mBrokerNode.register() beforehand?`);
      return;
    }
    if (this.subscriptions[node.id].topics[topic]) {
      node.error(`${node.id} is already subscribed to '${topic}'`);
      return;
    }
    this.subscriptions[node.id].topics[topic] = { qos };
    this.mqtt.subscribe(topic, qos, callback, node.id);
  }

  unsubscribe(topic: string, node: Node, removed = false): void {
    this.mqtt.unsubscribe(topic, node.id, removed);
    delete this.subscriptions[node.id].topics[topic];
  }

  restart(): boolean {
    if (this.bridge.state !== 'online') {
      this.warn('bridge is not online, ignoring restart request');
      return false;
    }
    if (this.restarting) {
      this.warn('bridge already restarting, ignoring restart request');
      return false;
    }

    this.log('restarting bridge');
    this.publish('bridge/request/restart', '');
    return true;
  }

  private setupMqtt() {
    this.mqtt.register(this);
    this.on('close', (done: () => void) => this.mqtt.deregister(this, done));
  }

  status(): void {
    // mqtt-broker will call this this when mqtt status changes
    this.refreshState();
  }

  private updateDevices(devices: Z2mDevice[]) {
    this.devices = devices.filter((device) => device.supported);
  }

  handleBridgeMessage(topic: string, buffer: Buffer, { retain }: IPublishPacket): void {
    const type = topic.slice(this.config.topic.length + 8);
    const message = buffer.toString();
    switch (type) {
      case 'state':
        this.bridge.state = ['online', 'offline'].includes(message) ? (message as BridgeState) : 'offline';
        this.refreshState();
        this.emit(`bridge:${message}`, retain);
        this.emit('bridge:state', message);
        break;
      case 'info':
        this.bridge.info = JSON.parse(message);
        break;
      case 'devices':
        this.bridge.devices = JSON.parse(message);
        this.updateDevices(this.bridge.devices);
        break;
      default:
        this.warn(`Unhandled bridge topic '${topic}'`);
        break;
    }
  }

  register(node: Node): void {
    if (this.subscriptions[node.id]) {
      node.warn(`${node.id} already registered, did you call Z2mBrokerNode.register() twice?`);
      return;
    }
    this.subscriptions[node.id] = { node, topics: {} };
    node.on('close', () => this.deregister(node));
  }

  deregister(node: Node, done?: () => void): void {
    if (this.subscriptions[node.id]) {
      const topics = Object.keys(this.subscriptions[node.id]);
      topics.forEach((topic) => {
        this.unsubscribe(topic, node, true);
      });
      if (done) {
        done();
      }
    }
  }

  private refreshState() {
    // prettier-ignore

    let state: BrokerState;
    if (this.mqtt.connected) {
      state = this.bridge.state;
    } else {
      state = this.mqtt.connecting ? 'connecting' : 'disconnected';
    }

    if (state !== this.state) {
      this.state = state;
      this.onStateChanged(state);
    }
  }

  private onStateChanged(state: BrokerState) {
    const colors: Record<BrokerState, NodeStatusFill> = {
      disconnected: 'red',
      offline: 'red',
      connecting: 'yellow',
      online: 'green',
    };

    const status: NodeStatus = {
      shape: ['disconnected', 'ready'].includes(state) ? 'dot' : 'ring',
      fill: colors[state],
      text: state,
    };

    Object.values(this.subscriptions).forEach(({ node }) => {
      node.status(status);
    });
  }
}
