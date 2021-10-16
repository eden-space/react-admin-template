import React from 'react';
import { Card } from 'antd';

const Dashboard: React.FC = () => {
  console.log('Dashboard');

  return (
    <Card>
      Dashboard:
      {navigator.userAgent}
    </Card>
  );
};

export default Dashboard;
