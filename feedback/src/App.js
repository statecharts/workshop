import React, { Component } from 'react';
import { Machine } from 'xstate';
import logo from './logo.svg';
import './App.css';

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

class App extends Component {
  static machine = machine;

  state = {
    appState: machine.initialState
  };

  componentDidMount() {
    window.addEventListener('keyup', e => {
      if (e.key === 'Escape') {
        this.send('ESC');
      }
    });
  }

  send(eventType) {
    this.setState({
      appState: machine.transition(this.state.appState, eventType)
    });
  }

  renderScreen() {
    const { appState } = this.state;
    switch (appState.value) {
      case 'question': {
        return (
          <div className="ui-screen" data-testid="question-screen">
            <p>How was your experience?</p>
            <button
              className="ui-button"
              onClick={_ => this.send('GOOD')}
              data-testid="good-button"
            >
              Good
            </button>
            <button
              className="ui-button"
              onClick={_ => this.send('BAD')}
              data-testid="bad-button"
            >
              Bad
            </button>
          </div>
        );
      }
      case 'form': {
        return (
          <div className="ui-screen" data-testid="form-screen">
            <p>Why?</p>
            <input type="text" className="ui-input" />
            <button
              className="ui-button"
              onClick={_ => this.send('SUBMIT')}
              data-testid="submit-button"
            >
              Submit
            </button>
          </div>
        );
      }
      case 'thanks': {
        return (
          <div className="ui-screen" data-testid="thanks-screen">
            <p>Thank you for your feedback.</p>
            <button
              className="ui-button"
              onClick={_ => this.send('CLOSE')}
              data-testid="close-button"
            >
              Close
            </button>
          </div>
        );
      }
      case 'closed':
      default:
        return null;
    }
  }

  render() {
    return (
      <div className="ui-app">
        {this.renderScreen()}
        {this.state.appState.value}
      </div>
    );
  }
}

export default App;
