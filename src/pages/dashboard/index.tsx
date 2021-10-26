import React, { useLayoutEffect } from 'react';
import { Card } from 'antd';
import BoundingClientRectObserver from '@/utils';

const Dashboard: React.FC = () => {
  useLayoutEffect(() => {
    const ob = new BoundingClientRectObserver((rect) => {
      console.log(rect);
    });

    ob.observe(document.querySelector('#a') as Element);
    ob.observe(document.querySelector('#b') as Element);
    ob.observe(document.querySelector('#c') as Element);
    ob.observe(document.querySelector('#d') as Element);

    setTimeout(() => {
      ob.unobserve(document.querySelector('#d') as Element);

      setTimeout(() => {
        ob.disconnect();
      }, 3000);
    }, 10000);
  }, []);
  return (
    <Card>
      Dashboard:
      {navigator.userAgent}
      <textarea name="aaa" id="a" cols={30} rows={10}/>
      <textarea name="aaa" id="b" cols={30} rows={10}/>
      <textarea name="aaa" id="c" cols={30} rows={10}/>
      <textarea name="aaa" id="d" cols={30} rows={10}/>

    </Card>
  );
};

export default Dashboard;
