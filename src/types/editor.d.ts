import type {
  EditorRED,
  EditorNodeDef as NodeDef,
  EditorNodeProperties as NodeProperties,
  EditorNodeCredentials as NodeCredential,
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
  const RED: EditorRED;

  namespace Editor {
    export { NodeDef, NodeProperties, NodeCredential };
  }
}
