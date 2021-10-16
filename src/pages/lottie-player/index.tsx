import React, { useLayoutEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import lottie, { AnimationItem, RendererType } from 'lottie-web';
import type { UploadProps } from 'antd';
import { Upload, notification, Tooltip } from 'antd';
import {
  CloudUploadOutlined,
  CaretRightOutlined,
  PauseOutlined,
  RetweetOutlined,
  FastForwardOutlined,
  FastBackwardOutlined,
} from '@ant-design/icons';
import Progress from './components/progress';
import DropMenu from './components/drop-menu';

import s from './index.module.less';

const { Dragger } = Upload;

interface IStatusProps {
  current: number;
  total: number;
  pause?: boolean;
  complete?: boolean;
}

interface IParamsProps {
  loop?: boolean;
  renderer?: RendererType;
}

const Home: React.FC = () => {
  const lottieRef = useRef(null);
  const aniRef = useRef<AnimationItem>();
  const [direction, setDirection] = useState<-1 | 1>(1);
  const [speed, setSpeed] = useState<number>(1);
  const [params, setParams] = useState<IParamsProps>({
    loop: true,
    renderer: 'svg',
  });
  const [animationData, setAnimationData] = useState<Record<string, any>>();
  const [status, setStatus] = useState<IStatusProps>({
    current: 0,
    total: 0,
  });

  const { loop } = params;
  const {
    current,
    total,
    pause,
    complete,
  } = status;

  useLayoutEffect(() => {
    if (lottieRef.current) {
      aniRef.current = lottie.loadAnimation({
        ...params,
        animationData,
        name: 'lottie-player',
        container: lottieRef.current,
        autoplay: true,
      });

      aniRef.current?.setDirection(direction);
      aniRef.current?.setSpeed(speed);

      aniRef.current?.addEventListener('enterFrame', (e: { currentTime: number; totalTime: number }) => {
        setStatus((prevState) => ({
          ...prevState,
          current: Math.round(e.currentTime),
          total: e.totalTime,
          pause: false,
          complete: false,
        }));
      });

      aniRef.current?.addEventListener('complete', () => {
        setStatus((prevState) => ({
          ...prevState,
          complete: true,
        }));
      });

      aniRef.current?.addEventListener('error', (e) => {
        console.error(e, 'error');
      });

      aniRef.current?.addEventListener('data_failed', (e) => {
        console.error(e, 'error');
      });
    }

    window.addEventListener('resize', onHandleWindowResize);

    return () => {
      lottie.destroy('lottie-player');
      window.removeEventListener('resize', onHandleWindowResize);
    };
  }, [animationData, params]);

  function onHandleWindowResize() {
    aniRef.current?.resize();
  }

  function onHandleTogglePause() {
    if (complete) {
      aniRef.current?.goToAndPlay(direction === 1 ? 0 : total, true);
      setStatus((prevState) => ({
        ...prevState,
        complete: false,
      }));
      return;
    }
    aniRef.current?.togglePause();
    setStatus((prevState) => ({
      ...prevState,
      pause: !pause,
    }));
  }

  function onHandleToggleLoop() {
    setParams((prevState) => ({
      ...prevState,
      loop: !loop,
    }));
  }

  function onHandleToggleDirection() {
    const d = direction === 1 ? -1 : 1;
    aniRef.current?.setDirection(d);
    setDirection(d);
  }

  function onHandleRenderTypeSpeed(type: RendererType) {
    setParams((prevState) => ({
      ...prevState,
      renderer: type,
    }));
  }

  function onHandleChangeSpeed(sp: number) {
    aniRef.current?.setSpeed(sp);
    setSpeed(sp);
  }

  const props: UploadProps = {
    name: 'file',
    accept: '.json',
    multiple: false,
    fileList: [],
    customRequest(info) {
      const file = info.file as unknown as { type: string; name: string; path: string, size: number };
      if (file.type !== 'application/json' || !file.name.endsWith('.json') || file.size <= 0) {
        notification.error({
          placement: 'top',
          message: '无效的文件',
          description: <span style={{ color: '#999' }}>Lottie Player 只能上传 Lottie 动画入口文件，且只能是json格式</span>,
        });
        setAnimationData(undefined);
        return;
      }

      const fr = new FileReader();
      fr.onload = function frLoad() {
        console.log(fr.result);
        try {
          const json = JSON.parse(fr.result as string) as (Record<string, any> & {
            layers: any[];
            assets: { u: string }[];
          });

          if (!json || !json.layers) {
            notification.error({
              placement: 'top',
              message: '无效的文件',
              description: <span style={{ color: '#999' }}>Lottie Player 只能上传 Lottie 动画入口文件，且只能是json格式</span>,
            });
            setAnimationData(undefined);
            return;
          }

          setAnimationData({
            ...json,
            assets: json.assets?.map((item: { u: string }) => ({
              ...item,
              u: `file://${file.path.replace(`${file.name}`, '')}${item.u}`,
            })),
          });
        } catch (e) {
          notification.error({
            placement: 'top',
            message: '未知错误',
          });
          setAnimationData(undefined);
        }
      };
      fr.readAsText(info.file as File);
    },
  };

  return (
    <div className={s.home}>
      <div ref={lottieRef} className={s.player} />
      <div className={s.uploader} style={{ opacity: animationData ? 0 : 1 }}>
        <Dragger className={s.drag} {...props}>
          <p className={s['uploader-icon']}>
            <CloudUploadOutlined />
          </p>
          <p className={s['uploader-text']}>Click or drag your Lottie JSON file</p>
          <p className={s['uploader-hint']}>Only support dotJSON file (dotLottie and ZIP file are on the way)</p>
        </Dragger>
      </div>

      {animationData && (
        <div className={s.footer}>
          <Progress percent={complete ? 100 : (current / total) * 100} />
          <div className={s.controls}>
            <div className={s.left}>
              <div className={s.action} onClick={onHandleTogglePause}>
                {pause || complete ? <CaretRightOutlined className={s.icon} /> : <PauseOutlined className={s.icon} />}
              </div>
              <div>{`${complete ? total : current} / ${total}`}</div>
            </div>
            <div className={s.right}>
              <DropMenu
                style={{ marginRight: 16 }}
                items={[
                  { key: 'html', label: 'html' },
                  { key: 'canvas', label: 'canvas' },
                  { key: 'svg', label: 'svg' },
                ]}
                onChange={(type) => onHandleRenderTypeSpeed(type as unknown as RendererType)}
              >
                <div style={{ paddingBottom: 4, fontSize: 18, textAlign: 'center' }}>{params.renderer}</div>
              </DropMenu>
              <Tooltip title={direction === 1 ? '点击倒放' : '点击正放'}>
                <div style={{ marginRight: 16, paddingTop: 5 }} onClick={onHandleToggleDirection}>
                  {direction === 1 && <FastForwardOutlined className={s.direction} />}
                  {direction === -1 && <FastBackwardOutlined className={s.direction} />}
                </div>
              </Tooltip>
              <Tooltip title={loop ? '关闭循环播放' : '开启循环播放'}>
                <RetweetOutlined
                  style={{ marginRight: 16 }}
                  className={classNames(s.icon, { [s.active]: loop })}
                  onClick={onHandleToggleLoop}
                />
              </Tooltip>
              <DropMenu
                items={[
                  { key: '5.0', label: '5.0x' },
                  { key: '4.0', label: '4.0x' },
                  { key: '3.0', label: '3.0x' },
                  { key: '2.5', label: '2.5x' },
                  { key: '2.0', label: '2.0x' },
                  { key: '1.5', label: '1.5x' },
                  { key: '1.0', label: '1.0x' },
                  { key: '0.5', label: '0.5x' },
                ]}
                onChange={(key) => onHandleChangeSpeed(Number(key))}
              >
                {`${speed.toFixed(1)}x`}
              </DropMenu>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
