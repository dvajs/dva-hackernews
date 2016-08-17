import React, { PropTypes } from 'react';
import { Link } from 'dva/router';
import styles from './ItemList.less';
import Spinner from './Spinner.jsx';
import Item from './Item.jsx';

const ItemList = ({ loading, items, page, maxPage }) => {
  return (
    <div className={styles.normal}>
      <Spinner loading={loading} />
      <div className={styles.nav}>
        {
          page > 1
            ? <Link to={`/top/${page - 1}`}>&lt; prev</Link>
            : <a className={styles.disabled}>&lt; prev</a>
        }
        <span>{`${page}/${maxPage}`}</span>
        {
          page < maxPage
            ? <Link to={`/top/${page + 1}`}>more &gt;</Link>
            : <a className={styles.disabled}>more &gt;</a>
        }
      </div>
      <div className={styles.list}>
        {
          items.map(item => <Item key={item.id} item={item} />)
        }
      </div>
    </div>
  );
};

export default ItemList;
