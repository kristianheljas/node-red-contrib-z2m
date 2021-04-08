import express, { ErrorRequestHandler, Router } from 'express';
import type { NodeAPI } from 'node-red';
import { PACKAGE_NAME, PACKAGE_NODES, PACKAGE_VERSION } from '../core/constants';
import Z2mBrokerNode, { Z2mBrokerNodeDef } from '../nodes/broker/node';

export interface Z2mPackageInfo {
  name: string;
  version: string;
  nodeTypes: string[];
  brokers: Exclude<Z2mBrokerNodeDef, 'z'>[];
}

const serveEditorAssets = express.static(`${__dirname}/../editor/`, {
  index: false,
  redirect: false,
  extensions: ['js', 'png', 'svg'],
});

export class Z2mApi {
  private router: Router;

  private packageInfo: Z2mPackageInfo;

  constructor(private red: NodeAPI) {
    this.packageInfo = {
      name: PACKAGE_NAME,
      version: PACKAGE_VERSION,
      nodeTypes: Object.keys(PACKAGE_NODES).filter((type) => type !== 'z2m-api'),
      brokers: [],
    };

    this.router = this.setupRouter();
    this.red.httpAdmin.use(`/${PACKAGE_NAME}`, this.router);
  }

  private setupRouter() {
    const router = Router();

    router.use('/editor', serveEditorAssets);

    this.registerRoutes(router);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
      res.status(500).json({
        message: error instanceof Error ? error.message : error,
      });
    };
    router.use(errorHandler);

    router.get('*', (req, res) => {
      res.status(404).json({
        message: `404 Not Found (${req.path})`,
      });
    });

    return router;
  }

  private registerRoutes(router: Router) {
    router.get('/info', (_req, res) => {
      res.json(this.info());
    });

    router.get('/broker/:brokerId', (req, res) => {
      res.send(this.brokerInfo(req.params.brokerId));
    });

    router.get('/broker/:brokerId/devices', (req, res) => {
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

    throw new Error(`Broker not found!`);
  }

  private brokerDevices(brokerId: string) {
    const broker = this.red.nodes.getNode(brokerId);

    if (broker instanceof Z2mBrokerNode) {
      if (broker.state !== 'online') {
        throw new Error(`Broker state is '${broker.state}', excpected 'online'!`);
      }
      return broker.devices;
    }

    throw new Error(`Broker not found!`);
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
