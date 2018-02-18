import test from 'ava';
import { h, app } from 'hyperapp';
import { initialState, actions, view } from './App';

let cleanup = null;
test.before(() => {
  cleanup = require('jsdom-global')();
});

test.after(() => {
  cleanup();
});

const mountList = ({ oncreate, onupdate }) => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const wrapped = (state, actions) => {
    return h('div', {
        oncreate: oncreate(state, actions),
        onupdate: onupdate(state, actions),
      }, [
        view(state, actions)
      ]);
    };

  return app(initialState, actions, wrapped, container);
};

test.cb('A user can add an item to the list', ava => {
  let todo = [
    (state, actions) => actions.setText('test'),
    (state, actions) => actions.addItem(),
    (state, actions) => {
      ava.deepEqual(state.items, ['test']);
      ava.end();
    },
  ];

  const progressTodo = (state, actions) => {
    if (todo.length === 0) return;
    todo.shift()(state, actions);
  };

  const list = mountList({
    oncreate: (state, actions) => () => {
      progressTodo(state, actions);
    },

    onupdate: (state, actions) => (element) => {
      progressTodo(state, actions);
    },
  });
});
