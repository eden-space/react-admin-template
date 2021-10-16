import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router';
import s from './index.module.less';

const NotFond: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={s.container}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary" onClick={() => navigate('/', { replace: true })}>Back Home</Button>}
      />
    </div>
  );
};

export default NotFond;
