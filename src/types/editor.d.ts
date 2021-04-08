import type {
  EditorRED as RED,
  EditorNodeDef as NodeDef,
  EditorNodeProperties as NodeProperties,
  EditorNodeCredentials as NodeCredential,
  EditorNodeInstance as NodeInstance,
} from 'node-red';

declare module '@node-red/editor-client' {
  interface Nodes {
    eachConfig(cb: (conf: NodeInstance) => boolean): void;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface NodeDef<TProps, TCreds, TInstProps> {
    onadd?: (this: NodeInstance<TInstProps>) => void;
    onremove?: (this: NodeInstance<TInstProps>) => void;
  }
}

declare global {
  const RED: RED;
  namespace Editor {
    export { RED, NodeDef, NodeProperties, NodeCredential, NodeInstance };
  }
  interface Window {
    WebKitMutationObserver: MutationObserver | undefined;
  }
}
