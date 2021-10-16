import React from 'react';
import ReactDom from 'react-dom';
import s from './index.module.less';

class Loading {
  private readonly div: HTMLDivElement;

  constructor() {
    this.div = document.createElement('div');
    this.div.id = 's-request-loading';
  }

  render() {
    if (document.querySelector('#s-request-loading')) {
      return;
    }
    document.body.appendChild(this.div);
    setTimeout(() => {
      ReactDom.render(<div>
        <div className={s.mask} />
        <div className={s.cycle} />
        <div className={s.loading}>
          <div>G</div>
          <div>N</div>
          <div>I</div>
          <div>D</div>
          <div>A</div>
          <div>O</div>
          <div>L</div>
        </div>
      </div>, this.div);
    });
  }

  close() {
    const unmountResult = ReactDom.unmountComponentAtNode(this.div);
    if (unmountResult && this.div.parentNode) {
      this.div.parentNode?.removeChild(this.div);
    }
  }
}
export default new Loading();
