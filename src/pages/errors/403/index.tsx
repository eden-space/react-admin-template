import React from 'react';
import { Result, Button } from 'antd';
import { useHistory } from 'react-router';
import s from './index.module.less';

const PermissionDenied: React.FC = () => {
  const history = useHistory();

  return (
    <div className={s.container}>
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={<Button type="primary" onClick={() => history.replace('/')}>Back Home</Button>}
      />
    </div>
  );
};

export default PermissionDenied;
