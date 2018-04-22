import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Machine } from 'xstate';

export const machine = Machine({
  initial: 'question',
  states: {
    question: {
      on: {
        GOOD: 'thanks',
        BAD: 'form',
        ESC: 'closed'
      }
    },
    form: {
      on: {
        SUBMIT: 'thanks',
        ESC: 'closed'
      }
    },
    thanks: {
      on: {
        CLOSE: 'closed',
        ESC: 'closed'
      }
    },
    closed: {}
  }
});

console.log(utils.getSimplePathsAsArray(machine));

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
