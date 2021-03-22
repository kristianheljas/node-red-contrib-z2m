import type {
  EditorRED,
  EditorNodeDef as NodeDef,
  EditorNodeProperties as NodeProperties,
  EditorNodeCredentials as NodeCredential,
} from 'node-red';

declare global {
  const RED: EditorRED;

  namespace Editor {
    export { NodeDef, NodeProperties, NodeCredential };
  }
}
