import { useContext, type Dispatch, type FC, type SetStateAction } from 'react'
import { BsCart } from 'react-icons/bs';
import { CartContext, setOpen } from './CartContext';

interface CartIconProps { }
 
const CartIcon: FC<CartIconProps> = () => {

    const products = useContext(CartContext)
    const open = useContext(setOpen)

    return ( 
        <div className='flex w-full justify-end px-4 py-4'>
            <button
            type='button'
            onClick={() => open((prev) => !prev)}
            className='flex items-center justify-center rounded-lg border bg-white p-2 text-sm font-medium text-indigo-600'>
            <BsCart className='mr-2 text-lg' />
            {products.reduce((acc, item) => acc + item.quantity, 0)}
            {' '}
            minutes
            </button>
        </div>
    );
}
 
export default CartIcon;