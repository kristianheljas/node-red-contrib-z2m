import express, { Router } from 'express';
import type { NodeAPI } from 'node-red';
import { PACKAGE_NAME, PACKAGE_NODES, PACKAGE_VERSION } from '../core/constants';
import { Z2mBrokerNode, Z2mBrokerNodeDef } from '../core/z2m-broker';

const serveStaticAssets = express.static(`${__dirname}/../frontend/`, {
  index: false,
  redirect: false,
  extensions: ['js', 'png', 'svg'],
});

export class Z2mApi {
  private router: Router;

  private packageInfo: {
    name: string;
    version: string;
    nodeTypes: string[];
  };

  constructor(private red: NodeAPI) {
    this.packageInfo = {
      name: PACKAGE_NAME,
      version: PACKAGE_VERSION,
      nodeTypes: Object.keys(PACKAGE_NODES).filter((type) => type !== 'z2m-api'),
    };

    this.router = Router();
    this.setupRoutes();
    this.red.httpAdmin.use(`/${PACKAGE_NAME}`, this.router);
  }

  private setupRoutes() {
    this.router.use('/assets', serveStaticAssets);

    this.router.get('/info', (_req, res) => {
      res.json(this.info());
    });

    this.router.get('/broker/:brokerId', (req, res) => {
      res.send(this.brokerInfo(req.params.brokerId));
    });

    this.router.get('/broker/:brokerId/devices', (req, res) => {
      res.json(this.brokerDevices(req.params.brokerId));
    });
  }

  private info() {
    return { ...this.packageInfo, brokers: this.brokers() };
  }

  private brokerInfo(brokerId: string) {
    const broker = this.red.nodes.getNode(brokerId);

    if (broker instanceof Z2mBrokerNode) {
      const { state, bridge } = broker;
      return { state, bridge };
    }

    throw new Error(
      `Node ID '${brokerId}' does not refer to a '${Z2mBrokerNode.type}' node, got '${broker.type}' instead!`,
    );
  }

  private brokerDevices(brokerId: string) {
    const broker = this.red.nodes.getNode(brokerId);

    if (broker instanceof Z2mBrokerNode) {
      return broker.devices;
    }

    throw new Error(
      `Node ID '${brokerId}' does not refer to a '${Z2mBrokerNode.type}' node, got '${broker.type}' instead!`,
    );
  }

  private brokers(): Z2mBrokerNodeDef[] {
    const brokers: Z2mBrokerNodeDef[] = [];
    this.red.nodes.eachNode((node) => {
      if (node.type === Z2mBrokerNode.type) {
        brokers.push(node as Z2mBrokerNodeDef);
      }
    });
    return brokers;
  }

  static register(RED: NodeAPI): Z2mApi {
    return new Z2mApi(RED);
  }
}

export default Z2mApi;
