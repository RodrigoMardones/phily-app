import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  toggleHamburgerMenu,
  setHamburgerMenuActive,
  getHamburgerMenuActive,
} from '@/components/store/dashboard/slice';

export default function useBurgerMenu() {
  const isOpen = useSelector(getHamburgerMenuActive);
  const dispatch = useDispatch();
  const handleOpen = useCallback(() => dispatch(toggleHamburgerMenu()), [dispatch]);
  const setOpen = useCallback(
    (value) => dispatch(setHamburgerMenuActive(value)),
    [dispatch]
  );
  return { isOpen, handleOpen, setOpen };
}