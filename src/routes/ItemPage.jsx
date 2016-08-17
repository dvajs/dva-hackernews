import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './ItemPage.less';
import { listSelector } from '../models/item/selectors';
import ItemList from '../components/ItemList.jsx';
import Layout from '../components/Layout.jsx';

function ItemPage({ app, items, page, maxPage, activeType }) {
  return (
    <Layout>
      <div className={styles.normal}>
        <ItemList
          loading={app.loading}
          items={items}
          page={page}
          maxPage={maxPage}
          activeType={activeType}
        />
      </div>
    </Layout>
  );
}

ItemPage.propTypes = {
};

function mapStateToProps(state, ownProps) {
  return {
    app: state.app,
    ...listSelector(state, ownProps),
  };
}

export default connect(mapStateToProps)(ItemPage);
