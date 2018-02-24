import { connect } from 'dva';
import styles from './UserPage.less';
import userSelector from '../selectors/user';
import Spinner from './Spinner';
import { timeAgo } from '../utils/filters';

function UserPage({ loading, user }) {
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
          { user.about ?
            <li className={styles.about} dangerouslySetInnerHTML={{ __html: user.about }} />
            : null }
        </ul>
        <p className={styles.links}>
          <a href={`https://news.ycombinator.com/submitted?id=${user.id}`} rel="noopener noreferrer" target="_blank">submissions</a>
          <span> | </span>
          <a href={`https://news.ycombinator.com/threads?id=${user.id}`} rel="noopener noreferrer" target="_blank">comments</a>
        </p>
      </div>
    );
  }

  return (
    <div className={styles.normal}>
      <Spinner loading={loading} />
      { user ? renderUser() : null }
    </div>
  );
}

function mapStateToProps(state, ownProps) {
  return {
    loading: state.loading.global,
    ...userSelector(state, ownProps),
  };
}

export default connect(mapStateToProps)(UserPage);
