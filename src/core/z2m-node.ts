import type { NodeDef } from 'node-red';
import { Node } from './node';
import { Z2mBrokerNode } from './z2m-broker';

export * from './node';

export interface Z2mNodeDef extends NodeDef {
  broker: string;
  topic: string;
}

export abstract class Z2mNode<TConfig extends Z2mNodeDef = Z2mNodeDef> extends Node<TConfig> {
  z2m: Z2mBrokerNode;

  constructor(config: Z2mNodeDef & TConfig) {
    super(config);
    this.z2m = this.red.nodes.getNode(config.broker) as Z2mBrokerNode;

    // Confguration nodes can be disabled
    if (this.z2m && this.z2m.configured) {
      this.z2m.register(this);
      this.setup();
    } else {
      this.status({
        shape: 'dot',
        fill: 'red',
        text: 'missing/disabled broker',
      });
      this.error('missing or disabled z2m-broker configuration');
    }
  }

  abstract setup(): void;
}
