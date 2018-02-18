import test from 'ava';
import { initialState, actions, view } from './App';

const runActions = transforms => (state, actions) =>
  transforms.reduce((nextState, transform) => {
    const modifier = transform(nextState, actions);
    return Object.assign({}, nextState, modifier);
  }, state);

const setTextAndAddItem = text => (state, actions) => (
  runActions([
    actions.setText(text),
    actions.addItem(),
  ])(state, actions)
);

test('initial view matches snapshot', ava => {
  ava.snapshot(view(initialState, actions));
});

test('view with item matches snapshot', ava => {
  const state = runActions([
    setTextAndAddItem('first'),
  ])(initialState, actions);

  ava.snapshot(view(state, actions));
});

test('view with text matches snapshot', ava => {
  const state = runActions([
    actions.setText('first'),
  ])(initialState, actions);

  ava.snapshot(view(state, actions));
});

test('initial state matches snapshot', ava => {
  ava.snapshot(initialState);
})

test('can add an item', ava => {
  const state = runActions([
    setTextAndAddItem('first'),
  ])(initialState, actions);

  ava.deepEqual(state.items, ['first']);
});

test('cannot add empty items', ava => {
  const state = runActions([
    setTextAndAddItem(''),
    setTextAndAddItem('foo'),
    setTextAndAddItem('bar'),
  ])(initialState, actions);

  ava.deepEqual(state.items, ['foo', 'bar']);
});

test('cannot add items with only whitespace', ava => {
  const state = runActions([
    setTextAndAddItem('           '),
    setTextAndAddItem("\t"),
    setTextAndAddItem("\r\n"),
  ])(initialState, actions);

  ava.deepEqual(state.items, []);
})

test('can update text', ava => {
  const state = runActions([
    actions.setText('first'),
  ])(initialState, actions);

  ava.is(state.text, 'first');
});

test('can remove an item', ava => {
  let state = runActions([
    setTextAndAddItem('first'),
    setTextAndAddItem('second'),
    setTextAndAddItem('third'),
  ])(initialState, actions);

  ava.deepEqual(state.items, ['first', 'second', 'third']);

  state = runActions([
    actions.remItem(1),
  ])(state, actions);

  ava.deepEqual(state.items, ['first', 'third']);
});
