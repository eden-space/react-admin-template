import React from 'react';
import { Result, Button } from 'antd';
import { useHistory } from 'react-router';
import s from './index.module.less';

const ServerError: React.FC = () => {
  const history = useHistory();

  return (
    <div className={s.container}>
      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
        extra={<Button type="primary" onClick={() => history.replace('/')}>Back Home</Button>}
      />
    </div>
  );
};

export default ServerError;
