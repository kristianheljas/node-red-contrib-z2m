// eslint-disable-next-line import/no-extraneous-dependencies
import 'selectize/index.d';
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

  namespace Selectize {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface IOptions<T, U> {
      items: string[];
      placeholder: string | undefined;
    }
    interface IApi<T, U> {
      $control: JQuery<HTMLDivElement>;
      $control_input: JQuery<HTMLInputElement>;
      $dropdown: JQuery<HTMLDivElement>;
      $dropdown_content: JQuery<HTMLDivElement>;
      $input: JQuery<HTMLSelectElement | HTMLInputElement>;
      $wrapper: JQuery<HTMLDivElement>;
      settings: IOptions<T, U>;
    }
  }

  interface Window {
    WebKitMutationObserver: MutationObserver | undefined;
  }
}
