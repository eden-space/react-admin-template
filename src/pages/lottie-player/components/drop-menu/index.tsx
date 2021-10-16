import React from 'react';
import { Dropdown, Menu } from 'antd';
import s from './index.module.less';

interface IDropMenuProps {
  style?: React.CSSProperties;
  items: { key: string; label: string }[];
  onChange?: (value: string) => void;
  children: React.ReactNode;
}

const DropMenu: React.FC<IDropMenuProps> = (props) => {
  const { style, items, onChange, children } = props;

  function onMenuSelect(e: { key: string }) {
    console.log(e);
    onChange?.(e.key);
  }

  return (
    <Dropdown
      arrow={false}
      placement="top"
      overlay={(
        <Menu
          onClick={onMenuSelect}
          items={items}
        />
      )}
    >
      <div style={style} className={s.text}>{children}</div>
    </Dropdown>
  );
};

export default DropMenu;
