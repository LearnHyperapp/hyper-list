import { app } from 'hyperapp';
import { initialState, actions, view } from './App';

// Mount the app
const main = app(initialState, actions, view, document.getElementById('root'))
