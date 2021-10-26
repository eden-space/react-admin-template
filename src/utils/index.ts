export interface IBoundingClientRectObserver {
  target: Element;
  rect: DOMRect;
}

const keys: (keyof DOMRect)[] = ['width', 'height', 'x', 'y', 'top', 'right', 'bottom', 'left'];

const rectHasChanged = (current: DOMRect, prev: DOMRect) => keys.some((key) => current[key] !== prev[key]);

class BoundingClientRectObserver {
  private rafId?: number;

  private observedNodes: Map<Element, IBoundingClientRectObserver>;

  private readonly callback: (rect: IBoundingClientRectObserver[]) => void;

  constructor(callback: (rect: IBoundingClientRectObserver[]) => void) {
    if (callback === undefined) {
      // eslint-disable-next-line max-len
      throw new Error('Uncaught TypeError: Failed to construct "BoundingClientRectObserver": 1 argument required, but only 0 present.');
    }

    if (Object.prototype.toString.call(callback) !== '[object Function]') {
      // eslint-disable-next-line max-len
      throw new Error('Uncaught TypeError: Failed to construct "BoundingClientRectObserver": parameter 1 is not of type "Function".');
    }

    this.rafId = undefined;
    this.observedNodes = new Map<Element, IBoundingClientRectObserver>();
    this.callback = callback;
  }

  private loop() {
    const hasNoChanged = Array.from(this.observedNodes).every(([target, data]) => {
      const newRect = target.getBoundingClientRect();
      const hasChanged = rectHasChanged(newRect, data.rect);
      if (hasChanged) {
        this.observedNodes.set(target, { target, rect: newRect });
      }
      return !rectHasChanged(newRect, data.rect);
    });

    if (!hasNoChanged) {
      this.callback(Array.from(this.observedNodes.values()));
    }

    this.rafId = window.requestAnimationFrame(this.loop.bind(this));
  }

  public observe(target: Element) {
    if (target === undefined) {
      // eslint-disable-next-line max-len
      throw new Error('Uncaught TypeError: Failed to execute "observe" on "BoundingClientRectObserver": 1 argument required, but only 0 present.');
    }

    if (!(target instanceof Element)) {
      // eslint-disable-next-line max-len
      throw new Error('Uncaught TypeError: Failed to execute "observe" on "BoundingClientRectObserver": parameter 1 is not of type "Element".');
    }

    const size = this.observedNodes.size === 0;

    if (!this.observedNodes.has(target)) {
      this.observedNodes.set(target, { target, rect: target.getBoundingClientRect() });
    }

    if (size) {
      this.loop();
    }
  }

  public unobserve(target: Element) {
    if (target === undefined) {
      // eslint-disable-next-line max-len
      throw new Error('Uncaught TypeError: Failed to execute "unobserve" on "BoundingClientRectObserver": 1 argument required, but only 0 present.');
    }

    if (!(target instanceof Element)) {
      // eslint-disable-next-line max-len
      throw new Error('Uncaught TypeError: Failed to execute "unobserve" on "BoundingClientRectObserver": parameter 1 is not of type "Element".');
    }

    this.observedNodes.delete(target);
  }

  public disconnect() {
    this.observedNodes.clear();
  }
}

export default BoundingClientRectObserver;
