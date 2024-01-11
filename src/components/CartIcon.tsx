import { BsCart } from "react-icons/bs";
import { Fragment, type Dispatch, type FC, type SetStateAction, useState } from 'react'
import Cart from "./Cart";

interface cartIconProps {
    setShowCart: Dispatch<SetStateAction<boolean>>
    products: { id: string; quantity: number }[]
}
 
const cartIcon: FC<cartIconProps> = (setShowCart, products) => {



    return ( 
        <>
            <div className='flex w-full justify-end px-2 max-h-10'>
                <button
                type='button'
                onClick={() => setShowCart((prev) => !prev)}
                className='flex items-center justify-center rounded-lg bg-gray-200 p-3 text-lg font-medium text-indigo-600'>
                <BsCart className='mr-2 text-lg' />
                {' '}
                minutes
                </button>
            </div>
        </>


     );
}
 
export default cartIcon;