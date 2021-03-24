// eslint-disable-next-line node/no-extraneous-import
import type { MQTTBrokerNode, MQTTMessage, SubscriptionCallback } from '@node-red/nodes/core/network/10-mqtt';
import type { QoS } from 'mqtt';
import type { NodeDef, NodeStatus, NodeStatusFill } from 'node-red';
import { CheckNodeOptions, Node } from './node';
import { Z2mBridgeInfo, Z2mBridgeState, Z2mDevice, Z2mUtil } from './util';

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

export type Z2mBrokerState = 'disconnected' | 'connecting' | 'offline' | 'online';

export interface Z2mBrokerNodeDef extends NodeDef {
  broker: string;
  topic: string;
}

@CheckNodeOptions
export class Z2mBrokerNode extends Node<Z2mBrokerNodeDef> {
  static type = 'z2m-broker';

  private mqtt: MQTTBrokerNode;

  configured = false;

  restarting = false;

  subscriptions: SubscriptionRegistry = {};

  state: Z2mBrokerState = 'disconnected';

  bridge: Z2mBridgeInfo | null = null;

  devices: Z2mDevice[] = [];

  constructor(config: Z2mBrokerNodeDef) {
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
    if (this.state !== 'online') {
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
    if (!this.mqtt.connected) {
      this.setState(this.mqtt.connecting ? 'connecting' : 'disconnected');
    } else {
      this.setState('offline');
    }
  }

  handleBridgeMessage(topic: string, buffer: Buffer): void {
    const type = topic.slice(this.config.topic.length + 8);
    const message = buffer.toString();
    switch (type) {
      case 'state':
        this.setState(message as Z2mBridgeState);
        break;
      case 'info':
        this.bridge = Z2mUtil.parseBridgeInfo(JSON.parse(message));
        break;
      case 'devices':
        this.devices = JSON.parse(message).filter(Z2mUtil.deviceSupported).map(Z2mUtil.parseDevice);
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

  private setState(state: Z2mBrokerState) {
    if (state !== this.state) {
      this.state = state;

      const colors: Record<Z2mBrokerState, NodeStatusFill> = {
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
}
