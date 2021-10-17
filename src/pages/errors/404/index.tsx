import React from 'react';
import { Result, Button } from 'antd';
import { useHistory } from 'react-router';
import s from './index.module.less';

const NotFond: React.FC = () => {
  const history = useHistory();

  return (
    <div className={s.container}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary" onClick={() => history.replace('/')}>Back Home</Button>}
      />
    </div>
  );
};

export default NotFond;
