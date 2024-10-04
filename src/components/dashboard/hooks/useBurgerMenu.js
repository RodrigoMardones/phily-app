import { useSelector, useDispatch } from 'react-redux';
import { toggleHamburgerMenu, getHamburgerMenuActive } from '@/components/store/dashboard/slice';

export default function useBurgerMenu(){
    const isOpen = useSelector(getHamburgerMenuActive);
    const dispatch = useDispatch();
    const handleOpen = () => dispatch(toggleHamburgerMenu());
    return { isOpen, handleOpen };
}