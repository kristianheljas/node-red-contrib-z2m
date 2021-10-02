import { Z2mNode, CheckNodeOptions } from '../../core/z2m-node';

@CheckNodeOptions
export default class Z2mBridgeLogsNode extends Z2mNode {
  static type = 'z2m-bridge-logs';

  setup(): void {
    this.z2m.subscribe('bridge/logging', 0, this.onLogMessage.bind(this), this);
  }

  private onLogMessage(topic: string, buffer: Buffer) {
    const { level, message: payload } = JSON.parse(buffer.toString());
    this.send({ topic, level, payload });
  }
}
