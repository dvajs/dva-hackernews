import { Link } from 'dva/router';
import styles from './Item.less';
import { host, timeAgo } from '../utils/filters';

const Item = ({ item }) => {
  const {
    score,
    title,
    url,
    type,
    id,
    by,
    descendants,
    time,
  } = item;

  return (
    <div className={styles.normal}>
      <span className={styles.score}>{score}</span>
      <span className={styles.title}>
        {
          url
            ? <span><a href={url} rel="noopener noreferrer" target="_blank">{title}</a><span className={styles.host}> ({host(url)})</span></span>
            : <Link to={`/item/${id}`}>{title}</Link>
        }
      </span>
      <br />
      <span className={styles.meta}>
        {
          type !== 'job'
            ? <span className={styles.by}>by <Link to={`/user/${by}`}>{by}</Link></span>
            : null
          }
        <span className={styles.time}>{` ${timeAgo(time)}`} ago</span>
        {
          type !== 'job'
            ? <span className={styles.commentsLink}>
              <span>{' | '}</span>
              <Link to={`/item/${id}`}>{descendants} comments</Link>
            </span>
            : null
        }
      </span>
      {
        type !== 'story'
          ? <span className={styles.label}>{type}</span>
          : null
      }
    </div>
  );
};

export default Item;
