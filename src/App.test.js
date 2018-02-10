import test from 'ava';
import { initialState, actions, view } from './App';

const runActions = transforms => (state, actions) =>
  transforms.reduce((nextState, transform) => {
    const modifier = transform(nextState, actions);
    return Object.assign({}, nextState, modifier);
  }, state);

test('initial view matches snapshot', ava => {
  ava.snapshot(view(initialState, actions));
});

test('view with item matches snapshot', ava => {
  const state = runActions([
    actions.addItem('first'),
  ])(initialState, actions);

  ava.snapshot(view(state, actions));
});

test('view with text matches snapshot', ava => {
  const state = runActions([
    actions.setText('first'),
  ])(initialState, actions);

  ava.snapshot(view(state, actions));
});

test('can add an item', ava => {
  ava.deepEqual(initialState.items, []);

  const state = runActions([
    actions.addItem('first'),
  ])(initialState, actions);

  ava.deepEqual(state.items, ['first']);
});

test('can add 3 empty items', ava => {
  const state = runActions([
    actions.addItem(''),
    actions.addItem(''),
    actions.addItem(''),
  ])(initialState, actions);

  ava.deepEqual(state.items, ['', '', '']);
})

test('can update text', ava => {
  ava.is(initialState.text, '');

  const state = runActions([
    actions.setText('first'),
  ])(initialState, actions);

  ava.is(state.text, 'first');
});

test('can remove an item', ava => {
  let state = runActions([
    actions.addItem('first'),
    actions.addItem('second'),
    actions.addItem('third'),
  ])(initialState, actions);

  ava.deepEqual(state.items, ['first', 'second', 'third']);

  state = runActions([
    actions.remItem(1),
  ])(state, actions);

  ava.deepEqual(state.items, ['first', 'third']);
});
