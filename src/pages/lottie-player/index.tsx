import React, { useLayoutEffect, useState, useRef } from 'react';
import lottie, { AnimationItem, RendererType } from 'lottie-web';
import type { UploadProps } from 'antd';
import { Upload, notification } from 'antd';
import { CloudDownloadOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet';
import StatsJs from 'stats.js';
import type TypeStatsJs from 'stats.js';
import Controller from './components/controller';

import s from './index.module.less';

const { Dragger } = Upload;

interface IStatusProps {
  current: number;
  total: number;
  pause: boolean;
  complete: boolean;
}

const Home: React.FC = () => {
  const lottieRef = useRef(null);
  const statsInstanceRef = useRef<TypeStatsJs>();
  const statsRafRef = useRef<number>();
  const aniInstanceRef = useRef<AnimationItem>();
  const [title, setTitle] = useState<string>();
  const [bgColor, setBgColor] = useState<string>('#fff');
  const [direction, setDirection] = useState<-1 | 1>(1);
  const [speed, setSpeed] = useState<number>(1);
  const [loop, setLoop] = useState<boolean>(true);
  const [rendererType, setRendererType] = useState<RendererType>('canvas');
  const [animationData, setAnimationData] = useState<Record<string, any>>();
  const [status, setStatus] = useState<IStatusProps>({
    complete: false,
    pause: false,
    current: 0,
    total: 0,
  });
  const [showStats, setShowStats] = useState(false);

  const {
    current,
    total,
    pause,
    complete,
  } = status;

  useLayoutEffect(() => {
    if (lottieRef.current && animationData) {
      aniInstanceRef.current = lottie.loadAnimation({
        name: 'lottie-player',
        container: lottieRef.current,
        loop,
        autoplay: true,
        renderer: rendererType,
        animationData,
      });

      aniInstanceRef.current?.setDirection(direction);
      aniInstanceRef.current?.setSpeed(speed);
      setStatus((prevState) => ({
        ...prevState,
        total: aniInstanceRef.current?.getDuration(true) || 0,
      }));

      aniInstanceRef.current?.addEventListener('enterFrame', (e: { currentTime: number; totalTime: number }) => {
        setStatus((prevState) => ({
          ...prevState,
          current: Math.round(e.currentTime),
          total: e.totalTime,
          pause: false,
          complete: false,
        }));
      });

      aniInstanceRef.current?.addEventListener('complete', () => {
        setStatus((prevState) => ({
          ...prevState,
          complete: true,
        }));
      });

      aniInstanceRef.current?.addEventListener('error', (e) => {
        console.error(e, 'error');
      });

      aniInstanceRef.current?.addEventListener('data_failed', (e) => {
        console.error(e, 'error');
      });
    }

    window.addEventListener('resize', onHandleWindowResize);

    return () => {
      lottie.destroy('lottie-player');
      window.removeEventListener('resize', onHandleWindowResize);
    };
  }, [animationData, loop, rendererType]);

  function onHandleWindowResize() {
    aniInstanceRef.current?.resize();
  }

  function onHandleTogglePause() {
    if (!animationData) {
      return;
    }
    if (complete) {
      aniInstanceRef.current?.goToAndPlay(direction === 1 ? 0 : total, true);
      setStatus((prevState) => ({
        ...prevState,
        complete: false,
      }));
      return;
    }
    aniInstanceRef.current?.togglePause();
    setStatus((prevState) => ({
      ...prevState,
      pause: !pause,
    }));
  }

  function onHandleToggleLoop() {
    setLoop(!loop);
  }

  function onHandleToggleDirection() {
    const d = direction === 1 ? -1 : 1;
    aniInstanceRef.current?.setDirection(d);
    setDirection(d);
  }

  function onHandleRenderTypeChange(type: RendererType) {
    setRendererType(type);
  }

  function onHandleChangeSpeed(sp: number) {
    aniInstanceRef.current?.setSpeed(sp);
    setSpeed(sp);
  }

  function onHandleBgColorChange(color: string) {
    setBgColor(color);
  }

  function onHandleToggleStats() {
    if (showStats) {
      onHandleRemoveStats();
      return;
    }
    onHandleShowStats();
  }

  function onHandleShowStats() {
    onHandleRemoveStats();
    statsInstanceRef.current = new StatsJs();

    document.body.appendChild(statsInstanceRef.current?.dom);
    statsInstanceRef.current.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

    function animate() {
      statsInstanceRef.current?.update();
      statsRafRef.current = requestAnimationFrame(animate);
    }
    statsRafRef.current = requestAnimationFrame(animate);
    setShowStats(true);
  }

  function onHandleRemoveStats() {
    if (statsRafRef.current) {
      cancelAnimationFrame(statsRafRef.current);
      statsRafRef.current = undefined;
    }

    if (statsInstanceRef.current) {
      document.body.removeChild(statsInstanceRef.current?.dom);
      statsInstanceRef.current = undefined;
    }
    setShowStats(false);
  }

  const draggerProps: UploadProps = {
    name: 'file',
    accept: '.json',
    multiple: false,
    fileList: [],
    openFileDialogOnClick: false,
    customRequest(info) {
      const file = info.file as unknown as { type: string; name: string; path: string, size: number };

      // json
      if (file.type === 'application/json' && file.size > 0) {
        const fr = new FileReader();
        fr.onload = function frLoad() {
          onParseJsonStr(fr.result as string, file);
        };
        fr.readAsText(info.file as File);
        return;
      }

      // 未识别的异常
      notification.error({
        placement: 'top',
        message: '无效的文件',
        description: <span style={{ color: '#999' }}>Lottie Player 只能上传 Lottie 动画入口文件，且只能是json格式</span>,
      });
      setTitle('Lottie Player');
      setAnimationData(undefined);
      onHandleRemoveStats();
    },
  };

  function onParseJsonStr(jsonStr: string, file: { type: string; name: string; path: string, size: number }) {
    try {
      const json = JSON.parse(jsonStr) as (Record<string, any> & {
        layers: any[];
        assets: { u: string }[];
      });

      if (!json || !json.layers) {
        notification.error({
          placement: 'top',
          message: '无效的文件',
          description: <span style={{ color: '#999' }}>Lottie Player 只能上传 Lottie 动画入口文件，且只能是json格式</span>,
        });
        setTitle('Lottie Player');
        setAnimationData(undefined);
        onHandleRemoveStats();
        return;
      }

      setTitle(file.path.split('/').slice(-2).join('/'));
      setAnimationData({
        ...json,
        assets: json.assets?.map((item: { u: string }) => ({
          ...item,
          u: `file://${file.path.replace(`${file.name}`, '')}${item.u}`,
        })),
      });
      onHandleShowStats();
    } catch (e) {
      console.error(e);
      notification.error({
        placement: 'top',
        message: '未知错误',
        description: '遇到了不可预知的异常，请检查文件内容是否异常',
      });
      setTitle(undefined);
      setAnimationData(undefined);
    }
  }

  return (
    <div className={s.container}>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <div style={{ background: bgColor }} className={s.screen}>
        <div ref={lottieRef} className={s.player} />
        <div
          style={{ opacity: animationData ? 0 : 1 }}
          className={s.uploader}
          onClick={onHandleTogglePause}
        >
          <Dragger className={s.drag} {...draggerProps}>
            <p className={s['uploader-icon']}>
              <CloudDownloadOutlined />
            </p>
            <p className={s['uploader-text']}>Drag your Lottie JSON file</p>
            <p className={s['uploader-hint']}>Only support JSON file (ZIP file support is on the way)</p>
          </Dragger>
        </div>
      </div>

      {animationData && (
        <Controller
          current={current}
          total={total}
          pause={pause}
          complete={complete}
          loop={loop}
          speed={speed}
          direction={direction}
          rendererType={rendererType}
          showStats={showStats}
          bgColor={bgColor}
          onTogglePause={onHandleTogglePause}
          onDirectionChange={onHandleToggleDirection}
          onToggleStats={onHandleToggleStats}
          onToggleLoop={onHandleToggleLoop}
          onSpeedChange={onHandleChangeSpeed}
          onBgColorChange={onHandleBgColorChange}
          onRenderTypeChange={onHandleRenderTypeChange}
        />
      )}
    </div>
  );
};

export default Home;
