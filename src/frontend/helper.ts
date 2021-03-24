declare const RED: Editor.RED;

function getBrokersFor(node: { z?: string }) {
  const brokers: string[] = [];
  try {
    RED.nodes.eachConfig((config) => {
      if (config.type === 'z2m-broker') {
        const enabled = !config.d;
        const accessible = !config.z || config.z === node.z;
        if (enabled && accessible) {
          brokers.push(config.id || '');
        }
      }
      return true;
    });
  } catch (e) {
    /* since using internal and undocumented APIs, fail gracefully */
  }
  return brokers;
}

export default class Z2mHelper {
  static registerType(nodeType: string, nodeDef: Partial<Editor.NodeDef>): void {
    RED.nodes.registerType(nodeType, {
      // Provide default values
      category: 'zigbee2mqtt',
      color: '#ffcc66',
      // Allow overwriting default values
      ...nodeDef,
      // Ensure common defaults always exist
      defaults: {
        name: { value: '' as string },
        testing: { value: '' as string },
        broker: {
          type: 'z2m-broker',
          required: true,
          value: '' as string,
        },
        ...nodeDef.defaults,
      },
      onadd() {
        // If only one broker is available, select it automatically
        const availableBrokers = getBrokersFor(this);
        if (availableBrokers.length === 1) {
          // eslint-disable-next-line prefer-destructuring
          this.broker = availableBrokers[0];
        }
        if (typeof nodeDef.onadd === 'function') {
          nodeDef.onadd.call(this);
        }
      },
    });
  }
}
