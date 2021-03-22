// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Z2mHelper {
  static registerType(nodeType: string, nodeDef: Partial<Editor.NodeDef>) {
    return RED.nodes.registerType(nodeType, {
      // Provide default values
      category: 'zigbee2mqtt',
      color: '#ffcc66',
      // Allow overwritin default values
      ...nodeDef,
      // Ensure common defaults always exist
      defaults: {
        name: { value: '' },
        broker: { type: 'mqtt-broker', required: true, value: '' },
        ...nodeDef.defaults,
      },
    });
  }
}
