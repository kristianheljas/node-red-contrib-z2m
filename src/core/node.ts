import type {
  Node as NRNode,
  NodeAPI,
  NodeDef,
  NodeMessage as NRNodeMessage,
  NodeCredentials,
  NodeSettings,
} from 'node-red';

export interface NodeConstructor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): any;
  type: string;
}

// Additional check that all nodes have common parameters like type
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const CheckNodeOptions = <U extends NodeConstructor>(_ctor: U): void => {};

export interface NodeMessage extends NRNodeMessage {
  [key: string]: unknown;
}

export interface Node<TConfig> extends NRNode {
  red: NodeAPI;
  config: TConfig;
  send(msg?: NodeMessage | NodeMessage[]): void;
}

export abstract class Node<TConfig extends NodeDef = NodeDef> {
  constructor(public config: TConfig) {
    this.red.nodes.createNode(this, config);
  }

  static register<TSets, TCreds>(
    this: NodeConstructor,
    RED: NodeAPI,
    opts?: {
      credentials?: NodeCredentials<TCreds>;
      settings?: NodeSettings<TSets>;
    },
  ): void {
    this.prototype.red = RED;
    RED.nodes.registerType(this.type, this.prototype.constructor, opts);
  }
}
