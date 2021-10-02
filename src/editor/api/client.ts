import type { Z2mPackageInfo } from '../../api/index';
import type { Z2mBridgeInfo, Z2mDevice } from '../../core/util';

export class ApiClient {
  constructor(public baseUrl: string) {}

  async get<T>(url: string): Promise<T> {
    const normalizedUrl = url.replace(/^\/+/, '');
    return new Promise((resolve, reject) => {
      $.ajax(`${this.baseUrl}/${normalizedUrl}`, {
        dataType: 'json',
        success: (data) => resolve(data),
        error: (jqXHR, textStatus, errorThrown) => {
          const message = jqXHR.responseJSON?.message || errorThrown || textStatus;
          reject(new Error(message));
        },
      });
    });
  }

  getPluginInfo(): Promise<Z2mPackageInfo> {
    return this.get('info');
  }

  getBrokerInfo(brokerId: string): Promise<Z2mBridgeInfo> {
    return this.get(`broker/${brokerId}`);
  }

  getBrokerDevices(brokerId: string): Promise<Z2mDevice[]> {
    return this.get(`broker/${brokerId}/devices`);
  }
}

export default new ApiClient('/node-red-contrib-z2m');
