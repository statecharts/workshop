import React, { Component } from 'react';
import { Machine } from 'xstate';
import logo from './logo.svg';
import './App.css';

export const machine = Machine({
  key: 'feedback',
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
        SUBMIT: {
          thanks: {
            actions: ['postForm'],
            cond: fullState => {
              console.log(fullState);
              return fullState.input.length > 0;
            }
          }
        },
        ESC: 'closed'
      },
      onEntry: ['focusInput'],
      onExit: ['clearForm']
    },
    thanks: {
      on: {
        CLOSE: 'closed',
        ESC: 'closed'
      },
      onEntry: ['acknowledge']
    },
    closed: {}
  }
});

class App extends Component {
  static machine = machine;

  state = {
    appState: machine.initialState,
    input: ''
  };

  inputRef = React.createRef();

  actions = {
    focusInput: () => this.focusInput(),
    postForm: (_, event) => console.log('POST:', event.value),
    clearForm: () => this.clearInput(),
    acknowledge: () => console.log('Submitted feedback!')
  };

  componentDidMount() {
    window.addEventListener('keyup', e => {
      if (e.key === 'Escape') {
        this.send('ESC');
      }
    });
  }

  focusInput() {
    this.inputRef.current.focus();
  }

  clearInput() {
    this.setState({ input: '' });
  }

  send(eventType) {
    const nextState = machine.transition(
      this.state.appState,
      eventType,
      this.state
    );
    const { actions } = nextState;

    console.log(actions);

    this.setState(
      {
        appState: nextState
      },
      () => {
        const nextExtState = actions.reduce((extState, action) => {
          const command = this.actions[action];
          // Find the command to execute, and execute it with the state and event
          return command(extState, eventType);
        }, this.state);
      }
    );
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
          <form
            className="ui-screen"
            data-testid="form-screen"
            onSubmit={e => {
              e.preventDefault();
              this.send({ type: 'SUBMIT', value: this.state.input });
            }}
          >
            <p>Why?</p>
            <input
              type="text"
              className="ui-input"
              ref={this.inputRef}
              onChange={e => this.setState({ input: e.target.value })}
            />
            <button className="ui-button" data-testid="submit-button">
              Submit
            </button>
          </form>
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
    return <div className="ui-app">{this.renderScreen()}</div>;
  }
}

export default App;
