import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './ItemPage.less';
import { itemSelector } from '../models/item/selectors';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import { host, timeAgo } from '../utils/filters';
import Comment from '../components/Comment';

function ItemPage({ app, item, itemsById }) {
  if (!item) return null;
  return (
    <Layout>
      <div className={styles.normal}>
        <Spinner loading={app.loading} />
        <div className={styles.header}>
          <a href={item.url}><h1>{item.title}</h1></a>
          <span className={styles.host}>{host(item.url)}</span>
          <p className={styles.meta}>
            <span>{`${item.score} points | by `}</span>
            <Link to={`/user/${item.by}`}>{item.by}</Link>
            <span>{` ${timeAgo(item.time)} ago`}</span>
          </p>
        </div>
        <div className={styles.comments}>
          <p className={styles.commentsHeader}>
            {item.kids ? `${item.descendants} comments` : 'No comments yet.'}
          </p>
          <div className={styles.commentChildren}>
            {
              item.kids
               ? item.kids.map(id => <Comment key={id} id={id} itemsById={itemsById} />)
               : null
            }
          </div>
        </div>
      </div>
    </Layout>
  );
}

ItemPage.propTypes = {
};

function mapStateToProps(state, ownProps) {
  return {
    app: state.app,
    ...itemSelector(state, ownProps),
  };
}

export default connect(mapStateToProps)(ItemPage);
