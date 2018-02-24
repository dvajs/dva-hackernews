
export function listSelector(state, ownProps) {
  const page = parseInt(ownProps.match.params.page || 1, 10);
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

export function itemSelector(state, ownProps) {
  const id = ownProps.match.params.itemId;
  const item = state.item.itemsById[id];

  return {
    item,
    itemsById: state.item.itemsById,
  };
}
