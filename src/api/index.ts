import type { NodeAPI, NodeDef } from 'node-red';
import express, { Router } from 'express';
import { PACKAGE_NAME, PACKAGE_VERSION, PACKAGE_NODES } from '../core/constants';

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

  private info() {
    return { ...this.packageInfo, brokers: this.brokers() };
  }

  private brokers(): NodeDef[] {
    const brokers: NodeDef[] = [];
    this.red.nodes.eachNode((node) => {
      if (node.type === 'z2m-broker') {
        brokers.push(node);
      }
    });
    return brokers;
  }

  private setupRoutes() {
    this.router.use('/assets', serveStaticAssets);

    this.router.get('/info', (_req, res) => {
      res.json(this.info());
    });
  }

  static register(RED: NodeAPI): Z2mApi {
    return new Z2mApi(RED);
  }
}

export default Z2mApi;
