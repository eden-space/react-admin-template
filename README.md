# Lottie Player

🎉 A player that can play lottie animation JSON files, powered by react and electron.

🎉 本项目为一个可以本地预览lottie动画文件的小播放器，可以方便在活动开发中辅助预览UX提供的动效资源。

## 一. 本地开发

```shell script
# 安装依赖
> yarn # npm install

# 启动前会构建dll
> yarn start # npm run start

# 启动不会构建dll，之前存在就用
> yarn dev # npm run dev

# 启动electron开发环境
> yarn electron # npm run electron
```

## 二. 代码风格

本项目对代码风格有一定的要求，具体参考`.eslintrc.js`、`.stylelintrc.js`、`.prettierrc.js`文件配置。

## 三. 提交规范

项目提交前会对`commit message`进行检查，不符合规范提交会被拒绝。`commit message`格式如下：

```
> type(scope?): subject // scope可选
```

提交的 `type` 可选值如下:

```javascript
['build', 'ci', 'chore', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test'];
```

### 四. 打包命令

> 本模板内置`electron`打包支持。

```shell script
# web打包，默认生产环境
> yarn build # npm run build

# electron打包，默认生产环境
> yarn package # npm run package

# electron打包，仅打包
> yarn package:only # npm run package:only
```
