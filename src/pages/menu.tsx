import Menu from '@components/Menu'
import Spinner from '@components/Spinner'
import { parseISO } from 'date-fns'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { cartInterval, now } from 'src/constants/config'
import { trpc } from 'src/utils/trpc'
import { BsCart } from 'react-icons/bs'
import Cart from '~/components/Cart'

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

  
  const [showCart, setShowCart] = useState<boolean>(false)
  const [productsInCart, setProductsInCart] = useState<{ id: string; quantity: number }[]>([])
  
  const addToCart = (id: string, quantity: number) => {
    setProductsInCart((prev) => {
      const existing = prev.find((item) => item.id === id)
      if (existing) {
        return prev.map((item) => {
          if (item.id === id) return { ...item, quantity: item.quantity + quantity * cartInterval }
          return item
        })
      }
      return [...prev, { id, quantity: cartInterval }]
    })
  }

  const removeFromCart = (id: string) => {
    setProductsInCart((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <>
      <Cart removeFromCart={removeFromCart} open={showCart} setOpen={setShowCart} products={productsInCart} />
      {isFetchedAfterMount && selectedTime ? (
        <div className='mx-auto mt-12 max-w-7xl sm:px-6 lg:px-8'>
          {/* Cart Icon */}
          <div className='flex w-full justify-end'>
            <button
              type='button'
              onClick={() => setShowCart((prev) => !prev)}
              className='flex items-center justify-center rounded-lg bg-gray-200 p-3 text-lg font-medium text-indigo-600'>
              <BsCart className='mr-2 text-lg' />
              {productsInCart.reduce((acc, item) => acc + item.quantity, 0)}
              {' '}
              minutes
            </button>
          </div>

          <Menu addToCart={addToCart} selectedTime={selectedTime} />
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