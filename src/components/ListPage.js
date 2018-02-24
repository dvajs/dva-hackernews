import { connect } from 'dva';
import styles from './ListPage.less';
import { listSelector } from '../selectors/item';
import ItemList from './ItemList';

function ListPage({ loading, items, page, maxPage, activeType, location }) {
  return (
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
  );
}

function mapStateToProps(state, ownProps) {
  return {
    loading: state.loading.global,
    ...listSelector(state, ownProps),
  };
}

export default connect(mapStateToProps)(ListPage);
