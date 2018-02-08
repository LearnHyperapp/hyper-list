import test from 'ava';
import { HyperObserver } from './_testUtil';
import 'undom/register';
import { initialState, actions, view } from './App';

test('view matches snapshot', ava => {
  ava.snapshot(view(initialState, actions));
});

test('mounts properly', ava => {
  const observer = new HyperObserver(initialState, actions, view);
  observer.mount();

  console.dir(observer.getTree())

  ava.is(observer.getTree(), 1);
});
