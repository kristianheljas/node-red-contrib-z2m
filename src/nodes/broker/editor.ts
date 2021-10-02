RED.nodes.registerType('z2m-broker', {
  category: 'config',
  defaults: {
    name: { value: '' },
    broker: { value: '', type: 'mqtt-broker', required: true },
    topic: { value: 'zigbee2mqtt', required: true },
  },
  label() {
    if (this.name) {
      return this.name;
    }

    const brokerNode = this.broker ? RED.nodes.node(this.broker) : null;
    if (brokerNode) {
      const mqttBrokerLabel = RED.utils.getNodeLabel(brokerNode as never);
      return `${mqttBrokerLabel} / ${this.topic}`;
    }

    return 'No MQTT broker!';
  },
});
