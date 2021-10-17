/**
 * ｜ 方法      ｜ 请求是否有主体  ｜ 成功的响应是否有主体 ｜ 安全  ｜ 幂等  ｜ 可缓存               ｜ HTML 表单是否支持 ｜
 * ｜ GET      ｜ 否            ｜ 是                ｜ 是    ｜ 是    ｜ 是                  ｜ 是              ｜
 * ｜ POST     ｜ 是            ｜ 是                ｜ 否    ｜ 否    ｜ 是(包含新鲜度信息除外) ｜ 是              ｜
 * ｜ OPTIONS  ｜ 否            ｜ 是                ｜ 是    ｜ 是    ｜ 否                  ｜ 否              ｜
 * ｜ HEAD     ｜ 否            ｜ 否                ｜ 是    ｜ 是    ｜ 是                  ｜ 否              ｜
 * ｜ CONNECT  ｜ 否            ｜ 是                ｜ 否    ｜ 否    ｜ 否                  ｜ 否              ｜
 * ｜ PUT      ｜ 是            ｜ 否                ｜ 否    ｜ 是    ｜ 否                  ｜ 否              ｜
 * ｜ DELETE   ｜ 可有          ｜ 可有               ｜ 否    ｜ 是    ｜ 否                  ｜ 否              ｜
 * ｜ TRACE    ｜ 否            ｜ 否                ｜ 是    ｜ 是    ｜ 否                  ｜ 否              ｜
 * ｜ PATCH    ｜ 是            ｜ 是                ｜ 否    ｜ 否    ｜ 否                  ｜ 否              ｜
 */

import qs from 'qs';
import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { errorHandler, dataHandler, IAxiosRequestConfig } from './exceptions';
import loading from './loading';

const noop = (args: any) => args;

class Request {
  private client: AxiosInstance;

  private readonly customConfig: IAxiosRequestConfig;

  private readonly errorHandler: (data: AxiosError) => Promise<any>;

  private readonly dataHandler: (data: AxiosResponse) => Promise<any>;

  constructor(config?: IAxiosRequestConfig) {
    this.errorHandler = config?.errorHandler || noop;
    this.dataHandler = config?.dataHandler || noop;

    delete config?.errorHandler;
    delete config?.dataHandler;

    this.customConfig = {
      background: Boolean(config?.background),
    };

    this.client = axios.create({
      timeout: 0, // 默认永不超时
      withCredentials: true, // 默认携带cookie
      paramsSerializer: (params: any) => qs.stringify(params),
      ...config,
    });
    this.useRequestInterceptors();
    this.useResponseInterceptors();
  }

  useRequestInterceptors() {
    this.client.interceptors.request.use(
      (config: IAxiosRequestConfig) => {
        if (!config?.background) {
          loading.render();
        }
        return config;
      },
      (error: AxiosError) => {
        console.log(error);
      },
    );
  }

  useResponseInterceptors() {
    this.client.interceptors.response.use(
      (response) => {
        const config = response.config as IAxiosRequestConfig;
        if (!config?.background) {
          loading.close();
        }
        if (this.dataHandler) {
          return this.dataHandler(response);
        }
        // 其他自定义业务处理
        return Promise.resolve(response.data);
      },
      (error: AxiosError) => {
        return this.errorHandler(error);
      },
    );
  }

  request(config: IAxiosRequestConfig) {
    const relConfig = { ...this.customConfig, ...config };
    const { method = 'get' } = relConfig;
    return this.client.request({
      ...relConfig,
      params: {
        ...(relConfig?.params as Record<string, any> || {}),
        _t: method.toLowerCase() === 'get' ? Date.now() : undefined,
      },
    });
  }
}
const client = new Request({
  errorHandler,
  dataHandler,
});
export { axios, Request };
export default client;
