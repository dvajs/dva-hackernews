
export function userSelector(state, ownProps) {
  return {
    user: state.user.usersById[ownProps.params.userId],
  };
}
