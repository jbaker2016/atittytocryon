import Menu from '@components/Menu'
import Spinner from '@components/Spinner'
import { parseISO } from 'date-fns'
import { useRouter } from 'next/router'
import { FC, useContext, useEffect, useState } from 'react'
import { cartInterval, cartMinimum, now } from 'src/constants/config'
import { trpc } from 'src/utils/trpc'
import Cart from '~/components/Cart'
import Popup from '~/components/Popup'
import Header from '~/components/Header'
import {  useShoppingCart } from '~/components/CartContext'

const MenuPage: FC = () => {
  const router = useRouter()

  const [selectedTime, setSelectedTime] = useState<string | null>(null) // as ISO string
  const { isFetchedAfterMount } = trpc.menu.checkMenuStatus.useQuery(undefined, {
    onError: () => {
      // Check for validity of selectedTime failed
      // Handle error accordingly (e.g. redirect to home page)
    },
  })

  useEffect(() => {

    const selectedTime = localStorage.getItem('selectedTime')
    
    if (!selectedTime) router.push('/')
    else {
      const date = parseISO(selectedTime)
      if (date < now) router.push('/')
      // Date is valid
      setSelectedTime(selectedTime)
    }
  }, [router])

   const { productsInCart, showPopup, addToCart } = useShoppingCart()

  return (
    <>
      {showPopup && <Popup />}
      <Header/>

      <Cart selectedTime={selectedTime||''}/>
      
      
      {isFetchedAfterMount && selectedTime ? (
        <div className='mx-auto mt-0 max-w-7xl sm:px-6 lg:px-8'>
          {/* Cart Icon */}
          
          
          <Menu addToCart={addToCart} selectedTime={selectedTime} productsInCart={productsInCart} />
        </div>
      ) : (
        <div className='flex h-screen items-center justify-center'>
          <Spinner />
        </div>
      )}
    </>
  )
}

export default MenuPage