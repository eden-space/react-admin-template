import React from 'react';
import { useNavigate } from 'react-router';
import { Card, Button } from 'antd';
import s from './index.module.less';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={s.home}>
      <Card>
        <Button type="primary" onClick={() => navigate('/dashboard')}>点击去工作台</Button>
      </Card>
    </div>
  );
};

export default Home;
