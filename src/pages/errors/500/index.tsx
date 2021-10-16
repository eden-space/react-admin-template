import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router';
import s from './index.module.less';

const ServerError: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={s.container}>
      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
        extra={<Button type="primary" onClick={() => navigate('/', { replace: true })}>Back Home</Button>}
      />
    </div>
  );
};

export default ServerError;
