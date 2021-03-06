import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';

import {
  // The react component which renders the spinner
  Spinner,
  // The reducer
  pendingTasksReducer,
  // The type of all actions which should modify the pending state
  pendingTask,
  // When a pending task has begun
  begin,
  // When a pending task has ended
  end
} from '../src';

import './style.css';

// The spinner will look at the `pendingTasks` key of the store. Make sure the reducer
// modifies this key!
// NB: the reducer could also have been imported as `import { pendingTasksReducer as pendingTasks } from 'react-redux-spinner'`
// and used the ES6 shorthand properties instead.
const reducer = combineReducers({
  pendingTasks: pendingTasksReducer
});

const store = createStore(reducer);

const root = document.createElement('div');
document.body.appendChild(root);

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.store = props.store;
    this.state = {
      pendingTasks: this.store.getState().pendingTasks
    };
    this.store.subscribe(() => this.setState({
      pendingTasks: this.store.getState().pendingTasks
    }));
    this.increase = this.increase.bind(this);
    this.decrease = this.decrease.bind(this);
  }

  getChildContext() {
    return { store: this.store };
  }

  increase() {
    store.dispatch({
      type: 'FETCHING_ASYNC_DATA',
      [ pendingTask ]: begin // key surrounded by [] to evaluate the value
    });
  }

  decrease() {
    if (this.state.pendingTasks === 0) {
      return;
    }

    store.dispatch({
      type: 'DONE_FETCHING_ASYNC_DATA',
      [ pendingTask ]: end // key surrounded by [] to evaluate the value
    });
  }

  render() {
    return (
      <div>
        <Spinner />
        <h1>react-redux-spinner example</h1>
        <div className="buttons">
          <button onClick={this.increase}>Start async task</button>
          <button onClick={this.decrease}>Finish async task</button>
        </div>
        <div className="state">
          Current pending tasks: { this.state.pendingTasks }
        </div>
      </div>
    );
  }
}

App.propTypes = {
  store: React.PropTypes.object.isRequired
};
App.childContextTypes = {
  store: React.PropTypes.object.isRequired
};

ReactDOM.render(<App store={store} />, root);
