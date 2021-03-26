import type { Z2mPackageInfo } from '../../api/index';
import type { Z2mBridgeInfo, Z2mDevice } from '../../core/util';

export class ApiClient {
  constructor(public baseUrl: string) {}

  get(url: string): JQuery.jqXHR {
    const normalizedUrl = url.replace(/^\/+/, '');
    return $.getJSON(`${this.baseUrl}/${normalizedUrl}`).fail((jqXHR, status, message) => {
      // eslint-disable-next-line no-console
      console.error({ message, status, jqXHR });
      throw Error(`Error querying api: ${message}`);
    });
  }

  getPluginInfo(): JQuery.jqXHR<Z2mPackageInfo> {
    return this.get('info');
  }

  getBrokerInfo(brokerId: string): JQuery.jqXHR<Z2mBridgeInfo> {
    return this.get(`broker/${brokerId}`);
  }

  getBrokerDevices(brokerId: string): JQuery.jqXHR<Z2mDevice[]> {
    return this.get(`broker/${brokerId}/devices`);
  }
}

export default new ApiClient('/node-red-contrib-z2m');
