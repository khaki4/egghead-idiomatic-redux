import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import todoApp from './reducers';
import App from './components/App';
import { createStore } from 'redux';
import throttle from 'lodash/throttle';
import { loadState, saveState } from './localStorage';

const persistedState = loadState();

/**
 * http://redux.js.org/docs/api/createStore.html
 * init state 로서 plain obect로 만들어진다
 * persistedState 같은 형태의 초기 state를 기존 reducer와 함께
 * createStore하는것은 테스트와 변형에 유리하다.
 * TODO: 테스트에 왜 유리한지 의문이다!
 */

const store = createStore(todoApp, persistedState);

/**
 * subcribe function은 dispatch가 일어날 때 마다 call되는데
 * saveState에서는 JSON.stringify라는 expensive operation을 한다.
 * 이를 줄이기 위해 lodash throttle을 사용한다.
 */
store.subscribe(throttle(() => {
  console.log('saveState...');
  saveState({
    todos: store.getState().todos,
  });
}, 1000));

console.log(store.getState());

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
