import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
import reportWebVitals from './utils/report-web-vitals';

function render(): void {
  const container = document.querySelector('#s-app-root') as HTMLElement;
  const root = createRoot(container);
  root.render(<App />);
}

render();

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
