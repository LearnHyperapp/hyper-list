import { app } from 'hyperapp';

export class HyperObserver {
  constructor (initialState, actions, view) {
    this.initialState = initialState
    this.actions = this.proxyActions(actions)
    this.view = this.proxyView(view)

    this.reset();
  }

  proxyView (view) {
    return (state, actions) => {
      this.lastTree = view(state, actions);
      return this.lastTree;
    }
  }

  proxyActions (actions, parents = []) {
    return new Proxy(actions, {
      get: (target, key) => {
        const action = target[key]
        if (typeof action === 'function') {
          return arg => {
            this.calledActions.push({ action: parents.concat(key).join('.'), arg: arg });
            return action(arg);
          }
        } else if (typeof action === 'object' && !Array.isArray(action)) {
          return this.proxyActions(target[key], [key]);
        }
        return action
      }
    })
  }

  reset () {
    this.lastState = this.initialState;
    this.calledActions = [];
    this.lastTree = this.view(this.initialState, this.actions);
  }

  mount () {
    if (this.target) throw new Error('Cannot mount more than once');
    this.target = document.createElement('div');
    document.body.appendChild(this.target);

    this.reset();

    return app(this.initialState, this.actions, this.view);
  }

  unmount () {
    if (!this.target) throw new Error('Cannot unmount when not mounted');
    document.body.removeChild(this.target);
    delete this.target;
  }

  getState () {
    return this.lastState;
  }

  getActions () {
    return this.calledActions;
  }

  getTree () {
    return this.lastTree;
  }
};


