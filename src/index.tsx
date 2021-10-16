import React from 'react';
import ReactDom from 'react-dom';
import appInfo from './utils/app-info';
import reportWebVitals from './utils/report-web-vitals';

function render(): void {
  import('./app').then((res) => {
    const App = res.default;
    ReactDom.render(
      <App />,
      document.getElementById('react-admin-template'),
    );
  }).catch(console.error);
}

render();

// app basic info
appInfo(process.env.BUILD_ENV !== 'production');

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);

// HMR
if (process.env.NODE_ENV === 'development') {
  if (module.hot) {
    module.hot.accept('./app', render);
  }
}
