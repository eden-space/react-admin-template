import React from 'react';
import { notification } from 'antd';

export default function notificationEor(code?: number | string, message?: string, url?: string) {
  notification.error({
    message: (
      <>
        <span>接口异常</span>
        <span style={{ color: '#ff4d4f' }}>{code}</span>
      </>
    ),
    description: (
      <>
        <div>{message}</div>
        <div style={{ marginTop: 10, fontSize: 12, opacity: .4, textAlign: 'right' }}>{url}</div>
      </>
    ),
  });
}
