import { useCallback, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTree } from '../../store/tree/slice';
import { setFindNodeName } from '../../store/dashboard/slice';

function collectNames(node, set) {
  if (node.name) set.add(node.name);
  if (node.children) {
    node.children.forEach((child) => collectNames(child, set));
  }
}

export default function useNodeFinder() {
  const dispatch = useDispatch();
  const { tree, name: treeName } = useSelector(getTree);
  const [query, setQuery] = useState('');

  const nodeNames = useMemo(() => {
    if (!treeName) return [];
    const names = new Set();
    collectNames(tree, names);
    return Array.from(names).sort();
  }, [tree, treeName]);

  const handleSearch = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed || !nodeNames.includes(trimmed)) return;
    dispatch(setFindNodeName(trimmed));
  }, [query, nodeNames, dispatch]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  }, [handleSearch]);

  return {
    query,
    setQuery,
    nodeNames,
    handleSearch,
    handleKeyDown,
  };
}
