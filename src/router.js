import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, Link, Redirect } from 'dva/router';
import ListPage from './routes/ListPage';
import ItemPage from './routes/ItemPage';
import UserPage from './routes/UserPage';

export default function({ history }) {
  return (
    <Router history={history}>
      <Redirect from="/" to="/top" />
      <Route path="/top(/:page)" component={ListPage} />
      <Route path="/new(/:page)" component={ListPage} />
      <Route path="/show(/:page)" component={ListPage} />
      <Route path="/ask(/:page)" component={ListPage} />
      <Route path="/job(/:page)" component={ListPage} />
      <Route path="/item(/:itemId)" component={ItemPage} />
      <Route path="/user(/:userId)" component={UserPage} />
    </Router>
  );
};
