import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './UserPage.less';
import Layout from '../components/Layout';
import { userSelector } from '../models/user/selectors';
import Spinner from '../components/Spinner';
import { timeAgo } from '../utils/filters';

function UserPage({ app, user }) {

  function renderUser() {
    return (
      <div>
        <h1>User : {user.id}</h1>
        <ul className={styles.meta}>
          <li>
            <span className={styles.label}>Created: </span>
            <span>{`${timeAgo(user.created)} ago`}</span>
          </li>
          <li>
            <span className={styles.label}>Karma: </span>
            <span>{user.karma}</span>
          </li>
          { user.about ? <li className={styles.about} dangerouslySetInnerHTML={{__html: user.about}} /> : null }
        </ul>
        <p className={styles.links}>
          <a href={`https://news.ycombinator.com/submitted?id=${user.id}`} target="_blank">submissions</a>
          <span> | </span>
          <a href={`https://news.ycombinator.com/threads?id=${user.id}`} target="_blank">comments</a>
        </p>
      </div>
    );
  }

  return (
    <Layout>
      <div className={styles.normal}>
        <Spinner loading={app.loading} />
        { user? renderUser() : null }
      </div>
    </Layout>
  );
}

UserPage.propTypes = {
};

function mapStateToProps(state, ownProps) {
  return {
    app: state.app,
    ...userSelector(state, ownProps),
  };
}

export default connect(mapStateToProps)(UserPage);
