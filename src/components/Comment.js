import React, { Component } from 'react';
import { Link } from 'dva/router';
import styles from './Comment.less';
import { timeAgo } from '../utils/filters';

function pluralize(n) {
  return n + (n === 1 ? ' reply' : ' replies');
}

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
    };
  }

  handleExpand = (e) => {
    e.preventDefault();
    this.setState({
      open: !this.state.open,
    });
  }

  render() {
    const { id, itemsById } = this.props;
    const comment = itemsById[id];
    const { open } = this.state;
    if (!comment) return null;

    return (
      <div className={styles.normal}>
        <div className={styles.by}>
          <Link to={`/user/${comment.by}`}>{comment.by}</Link>
          <span>{` ${timeAgo(comment.time)} ago`}</span>
          {
            comment.kids
              ? (<span> | <a href="" className={styles.expand} onClick={this.handleExpand}>
                {`${open ? 'collapse' : 'expand'} ${pluralize(comment.kids.length)}`}
              </a></span>)
              : null
          }
        </div>
        <div className={styles.text} dangerouslySetInnerHTML={{ __html: comment.text }} />
        <div className={styles.commentChildren}>
          {
            comment.kids && open
              ? comment.kids.map(id => <Comment key={id} id={id} itemsById={itemsById} />)
              : null
          }
        </div>
      </div>
    );
  }
}

export default Comment;
