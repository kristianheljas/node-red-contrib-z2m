import type { EditorNodeDef, EditorNodeProperties } from 'node-red';
import { getBrokersFor } from './util';

interface CommonProps extends EditorNodeProperties {
  name: string;
  broker: string;
  [key: string]: unknown;
}

export const defaults = {
  name: { value: '' },
  broker: {
    type: 'z2m-broker',
    required: true,
    value: '',
  },
};

export class Registrator {
  static registerType<TProps extends CommonProps, TCreds = undefined, TInstProps extends TProps = TProps>(
    nodeType: string,
    nodeDef: PartialBy<EditorNodeDef<TProps, TCreds, TInstProps>, 'category'>,
  ): void {
    RED.nodes.registerType(nodeType, {
      category: 'zigbee2mqtt',
      color: '#ffcc66',
      ...nodeDef,
      onadd() {
        // If only one broker is available, select it automatically
        const availableBrokers = getBrokersFor(this);
        if (availableBrokers.length === 1) {
          // eslint-disable-next-line prefer-destructuring

          // FIXME: `this.broker` should be typed via `src/types/editor.d.ts`
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore 2339
          [this.broker] = availableBrokers;
        }
        if (typeof nodeDef.onadd === 'function') {
          nodeDef.onadd.call(this);
        }
      },
    });
  }
}
