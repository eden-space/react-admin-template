import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router';
import s from './index.module.less';

const PermissionDenied: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={s.container}>
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={<Button type="primary" onClick={() => navigate('/', { replace: true })}>Back Home</Button>}
      />
    </div>
  );
};

export default PermissionDenied;
