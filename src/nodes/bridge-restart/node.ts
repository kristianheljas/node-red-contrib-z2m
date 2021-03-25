import { Z2mNode, CheckNodeOptions } from '../../core/z2m-node';

@CheckNodeOptions
export default class Z2mBridgeRestartNode extends Z2mNode {
  static type = 'z2m-bridge-restart';

  setup(): void {
    this.on('input', () => {
      this.z2m.restart();
      this.status({
        shape: 'ring',
        fill: 'yellow',
        text: 'restart requested',
      });
    });
  }
}
