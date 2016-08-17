import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, Link, Redirect } from 'dva/router';
import ItemPage from './routes/ItemPage';

export default function({ history }) {
  return (
    <Router history={history}>
      <Redirect from="/" to="/top" />
      <Route path="/top(/:page)" component={ItemPage} />
      <Route path="/new(/:page)" component={ItemPage} />
      <Route path="/show(/:page)" component={ItemPage} />
      <Route path="/ask(/:page)" component={ItemPage} />
      <Route path="/job(/:page)" component={ItemPage} />
    </Router>
  );
};
