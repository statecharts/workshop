import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { render, Simulate, wait } from 'react-testing-library';
import * as graphUtils from 'xstate/lib/graph';

const { machine } = App;
const simplePaths = graphUtils.getSimplePathsAsArray(machine);

for (const { state: finalState, paths: statePaths } of simplePaths) {
  describe(`'${finalState}' state`, () => {
    statePaths.forEach((paths, i) => {
      describe(`path ${i}`, () => {
        const { getByTestId } = render(<App />);
        const heuristics = {
          question: () => getByTestId('question-screen'),
          form: () => getByTestId('form-screen'),
          thanks: () => getByTestId('thanks-screen'),
          closed: () => true
        };

        const actions = {
          GOOD: () => Simulate.click(getByTestId('good-button')),
          BAD: () => Simulate.click(getByTestId('bad-button')),
          SUBMIT: () => Simulate.click(getByTestId('submit-button')),
          CLOSE: () => Simulate.click(getByTestId('close-button')),
          ESC: () => Simulate.keyUp(window, { key: 'Esc' })
        };

        for (const { state, event } of paths.concat({ state: finalState })) {
          it(
            `is in '${state}'` + (event ? ` and sends '${event}'` : ''),
            () => {
              // assert we're in the right state
              heuristics[state]();

              // execute the event
              event && actions[event]();
            }
          );
        }
      });
    });
  });
}
