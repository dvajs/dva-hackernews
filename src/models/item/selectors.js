
export function listSelector(state, ownProps) {
  const page = parseInt(ownProps.params.page || 1, 10);
  const { itemsPerPage, activeType, lists, itemsById } = state.item;
  const ids = lists[activeType].slice(itemsPerPage * (page - 1), itemsPerPage * page);
  const items = ids.reduce((memo, id) => {
    if (itemsById[id]) memo.push(itemsById[id]);
    return memo;
  }, []);
  const maxPage = Math.ceil(lists[activeType].length / itemsPerPage);
  return {
    items,
    page,
    maxPage,
    activeType,
  };
}
