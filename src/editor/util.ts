export function getBrokersFor(node: { z?: string }): string[] {
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

export default {};
