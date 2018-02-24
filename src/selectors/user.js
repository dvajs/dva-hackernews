
export default function userSelector(state, ownProps) {
  return {
    user: state.user.usersById[ownProps.match.params.userId],
  };
}
