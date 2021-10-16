import React from 'react';
import s from './index.module.less';

const Progress: React.FC<{ percent?: number }> = (props) => {
  const { percent } = props;

  return (
    <div className={s.progress}>
      <div className={s.outer}>
        <div style={{ width: `${percent}%` }} className={s.inner} />
      </div>
    </div>
  );
};

export default Progress;
