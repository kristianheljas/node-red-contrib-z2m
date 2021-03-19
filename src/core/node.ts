import type {
  Node as NRNode,
  NodeAPI,
  NodeDef,
  NodeMessage as NRNodeMessage,
  NodeCredentials,
  NodeSettings,
} from 'node-red';

export interface NodeMessage extends NRNodeMessage {
  [key: string]: unknown;
}

export interface Node<TConfig> extends NRNode {
  red: NodeAPI;
  config: NodeDef & TConfig;
  send(msg?: NodeMessage | NodeMessage[]): void;
}
export abstract class Node<TConfig = unknown> {
  protected constructor(public config: NodeDef & TConfig) {
    this.red.nodes.createNode(this, config);
  }

  static register<TSets, TCreds>(
    RED: NodeAPI,
    type: string,
    opts?: {
      credentials?: NodeCredentials<TCreds>;
      settings?: NodeSettings<TSets>;
    },
  ): void {
    this.prototype.red = RED;
    RED.nodes.registerType(type, this.prototype.constructor as never, opts);
  }
}
