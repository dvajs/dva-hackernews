import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './ListPage.less';
import { listSelector } from '../models/item/selectors';
import ItemList from '../components/ItemList';
import Layout from '../components/Layout';

function ListPage({ loading, items, page, maxPage, activeType, location }) {
  return (
    <Layout>
      <div className={styles.normal}>
        <ItemList
          loading={loading}
          items={items}
          page={page}
          maxPage={maxPage}
          activeType={activeType}
          location={location}
        />
      </div>
    </Layout>
  );
}

ListPage.propTypes = {
};

function mapStateToProps(state, ownProps) {
  return {
    loading: state.loading.global,
    ...listSelector(state, ownProps),
  };
}

export default connect(mapStateToProps)(ListPage);
