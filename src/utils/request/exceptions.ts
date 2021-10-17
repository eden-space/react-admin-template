import { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { statusCodeMap } from './constants';
import notificationError from './notification';
import loading from './loading';

export interface IAxiosResponse extends AxiosResponse<any> {
  data: {
    code?: number;
    BaseResp: {
      StatusCode: number;
      StatusMessage: string;
    }
  }
}
export interface IAxiosRequestConfig extends AxiosRequestConfig {
  background?: boolean;
  dataHandler?: (data: any) => Promise<any>;
  errorHandler?: (data: any) => Promise<any>;
}

export class ResponseException extends Error {
  private readonly code: string | number;

  private readonly config: AxiosRequestConfig;

  private readonly response?: AxiosResponse;

  private readonly isAxiosError: boolean;

  private request?: AxiosResponse;

  constructor(code: number, message: string, config: AxiosRequestConfig, response?: AxiosResponse) {
    super();
    this.code = code;
    this.message = message;
    this.config = config;
    this.response = response;
    this.isAxiosError = false;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.request = response?.request;
  }

  toString() {
    return `code: ${this.code}; message: ${this.message}}`;
  }
}

export function errorHandler(error: AxiosError) {
  const { config, response, code, message } = error;
  if (!response) {
    notificationError(code, message, config.url);
    return Promise.reject(error);
  }

  const { status, statusText, data } = response;
  // 优先使用服务端定义错误消息，字段[message]根据业务而定
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const serverSideMessage = (data as unknown as any)?.message as string;
  const statusCodeMessage = statusCodeMap.get(status);
  const msg = serverSideMessage || statusCodeMessage || statusText || message || '未知错误';
  if (!(config as IAxiosRequestConfig)?.background) {
    loading.close();
  }
  notificationError(status, msg, config.url);
  if (status) {
    if (status === 401) {
      console.log('@todo 需要登陆逻辑？');
    }
    if (status === 403) {
      console.log('@todo 需要权限不足逻辑？');
    }
    return Promise.reject(new ResponseException(status, msg, config, response));
  }
  return Promise.reject(new ResponseException(status || -1, msg, config, response));
}

export function dataHandler(response: IAxiosResponse) {
  const { config, data } = response;
  const baseResp = data?.BaseResp;
  const code = data?.code || 0;
  const statusCode = baseResp?.StatusCode || 0;
  const statusMessage = baseResp?.StatusMessage;
  if (code !== 0) {
    return Promise.reject(data);
  }
  if (statusCode !== 0) {
    notificationError(statusCode, statusMessage, config.url);
    return Promise.reject(data);
  }
  return Promise.resolve(data);
}
