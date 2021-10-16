import React from 'react';
import classNames from 'classnames';
import { SketchPicker } from 'react-color';
import { RendererType } from 'lottie-web';
import { Popover, Tooltip } from 'antd';
import {
  CaretRightOutlined, DashboardOutlined,
  NodeCollapseOutlined,
  NodeExpandOutlined,
  PauseOutlined,
  RetweetOutlined,
} from '@ant-design/icons';

import DropMenu from '../drop-menu';
import Progress from '../progress';
import s from './index.module.less';

export interface ControllerProps {
  current: number;
  total: number;
  loop: boolean;
  speed: number;
  pause: boolean;
  complete: boolean;
  direction: -1 | 1;
  rendererType: RendererType;
  showStats: boolean;
  bgColor: string;
  onTogglePause: () => void;
  onDirectionChange: () => void;
  onToggleStats: () => void;
  onToggleLoop: () => void;
  onSpeedChange: (s: number) => void;
  onBgColorChange: (hex: string) => void;
  onRenderTypeChange: (v: RendererType) => void;
}

const Controller: React.FC<ControllerProps> = (props) => {
  const {
    pause,
    complete,
    current,
    total,
    speed,
    rendererType,
    direction,
    showStats,
    loop,
    bgColor,
    onBgColorChange,
    onToggleLoop,
    onTogglePause,
    onDirectionChange,
    onSpeedChange,
    onToggleStats,
    onRenderTypeChange,
  } = props;

  return (
    <div className={s.controller}>
      <Progress percent={complete ? 100 : (current / total) * 100} />
      <div className={s.controls}>
        <div className={s.left}>
          <div className={s.action} onClick={onTogglePause}>
            {pause || complete ? <CaretRightOutlined className={s.icon} /> : <PauseOutlined className={s.icon} />}
          </div>
          <div style={{ marginRight: 16 }}>{`${complete ? total : current} / ${total}`}</div>
        </div>
        <div className={s.right}>
          <DropMenu
            style={{ marginRight: 16 }}
            items={[
              { key: 'html', label: 'html' },
              { key: 'canvas', label: 'canvas' },
              { key: 'svg', label: 'svg' },
            ]}
            onChange={(type) => onRenderTypeChange(type as unknown as RendererType)}
          >
            <div style={{ paddingBottom: 4, textAlign: 'center' }}>{rendererType}</div>
          </DropMenu>
          <Popover
            overlayClassName={s.popover}
            showArrow={false}
            content={(
              <SketchPicker
                disableAlpha
                color={bgColor}
                onChange={(e) => onBgColorChange(e.hex)}
              />
            )}
          >
            <div style={{ background: bgColor }} className={s.background} />
          </Popover>
          <Tooltip title={direction === 1 ? '切换为倒放' : '切换为正放'}>
            <div style={{ marginRight: 16, paddingTop: 5 }} onClick={onDirectionChange}>
              {direction === 1 && <NodeExpandOutlined className={s.direction} />}
              {direction === -1 && <NodeCollapseOutlined className={s.direction} />}
            </div>
          </Tooltip>
          <DropMenu
            items={[
              { key: '5.0', label: '5.0x' },
              { key: '3.0', label: '3.0x' },
              { key: '2.5', label: '2.5x' },
              { key: '2.0', label: '2.0x' },
              { key: '1.5', label: '1.5x' },
              { key: '1.0', label: '1.0x' },
              { key: '0.5', label: '0.5x' },
              { key: '0.1', label: '0.1x' },
            ]}
            onChange={(key) => onSpeedChange(Number(key))}
          >
            {`${speed.toFixed(1)}x`}
          </DropMenu>
          <Tooltip title={loop ? '关闭循环播放' : '开启循环播放'}>
            <RetweetOutlined
              style={{ marginLeft: 16 }}
              className={classNames(s.icon, { [s.active]: loop })}
              onClick={onToggleLoop}
            />
          </Tooltip>
          <DashboardOutlined
            style={{ marginLeft: 16 }}
            className={classNames(s.stats, { [s.active]: showStats })}
            onClick={onToggleStats}
          />
        </div>
      </div>
    </div>
  );
};

export default Controller;
