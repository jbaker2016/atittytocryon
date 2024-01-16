import { Spinner } from '@chakra-ui/react'
import { Dialog, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import { Fragment, type Dispatch, type FC, type SetStateAction, useState } from 'react'
import { HiX } from 'react-icons/hi'
import { trpc } from 'src/utils/trpc'
import { capitalize } from '~/utils/helpers'
import { useShoppingCart } from './CartContext'

interface CartProps {
  selectedTime: string
}

const Cart: FC<CartProps> = ({ selectedTime }) => {

  const { closeCart, showCart, productsInCart, removeFromCart} = useShoppingCart()

  const router = useRouter()

  // tRPC
  const { data: itemsInCart } = trpc.menu.getCartItems.useQuery(productsInCart)
  const { mutate: checkout, isLoading } = trpc.checkout.checkoutSession.useMutation({
    onSuccess: ({ url }) => {
      router.push(url)
    },
    
    onMutate: ({ products }) => {
      localStorage.setItem('shopping-cart', JSON.stringify(products))
    },
    
  })

  const total = (
    itemsInCart?.reduce(
      (acc, item) => acc + item.price * itemsInCart.find((i) => i.id === item.id)!.quantity!,
      0
    ) ?? 0
  ).toFixed(2)

  const minutes = (
    itemsInCart?.reduce(
      (acc, item) => acc + itemsInCart.find((i) => i.id === item.id)!.quantity!,
      0
    ) ?? 0
  ).toFixed(0)

  const[nameCustomer, setNameCustomer] = useState('');
  const[emailCustomer, setEmailCustomer] = useState('');
  const[phoneCustomer, setPhoneCustomer] = useState('');


  const { mutateAsync: createEmptyReservation } = trpc.reservation.createEmptyReservation.useMutation()
  const { mutateAsync: addReservation } =  trpc.reservation.addReservation.useMutation()
  
  const handleCreateEmptyReservation = async () => {
    const data = createEmptyReservation()
    return (await data).id
  }


  async function handleCheckOut(event: any){

    event.preventDefault()

    const reservationId = await handleCreateEmptyReservation()

    addReservation({
      reservationId: reservationId,
      nameCustomer: nameCustomer,
      emailCustomer: emailCustomer,
      phoneCustomer: phoneCustomer,
      selectedTime: localStorage.getItem('selectedTime')||'',
      minutes: minutes,
      cost: total,
    })
    

    const customer = {reservationId, nameCustomer, emailCustomer, phoneCustomer, minutes, total}
    localStorage.setItem('customer', JSON.stringify(customer))

    checkout({ reservationId, products:productsInCart, nameCustomer, emailCustomer, phoneCustomer, selectedTime })
  }

  return (
    <Transition.Root show={showCart} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={closeCart}>
        <Transition.Child
          as={Fragment}
          enter='ease-in-out duration-500'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in-out duration-500'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'>
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-hidden'>
          <div className='absolute inset-0 overflow-hidden'>
            <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10'>
              <Transition.Child
                as={Fragment}
                enter='transform transition ease-in-out duration-500 sm:duration-700'
                enterFrom='translate-x-full'
                enterTo='translate-x-0'
                leave='transform transition ease-in-out duration-500 sm:duration-700'
                leaveFrom='translate-x-0'
                leaveTo='translate-x-full'>
                <Dialog.Panel className='pointer-events-auto w-screen max-w-md'>
                  <div className='flex h-full flex-col overflow-y-scroll bg-white shadow-xl'>
                    <div className='flex-1 overflow-y-auto py-6 px-4 sm:px-6'>
                      <div className='flex items-start justify-between'>
                        <Dialog.Title className='text-lg font-medium text-gray-900'>
                          Shopping cart
                        </Dialog.Title>
                        <div className='ml-3 flex h-7 items-center'>
                          <button
                            type='button'
                            className='-m-2 p-2 text-gray-400 hover:text-gray-500'
                            onClick={closeCart}>
                            <span className='sr-only'>Close panel</span>
                            <HiX className='h-6 w-6' aria-hidden='true' />
                          </button>
                        </div>
                      </div>

                      <div className='mt-8'>
                        <div className='flow-root'>
                          <ul role='list' className='-my-6 divide-y divide-gray-200'>
                            {itemsInCart?.map((item) => {
                              const thisItem = productsInCart.find((product) => product.id === item.id)
                              return (
                                <li key={item.id} className='flex py-6'>
                                  <div className='h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200'>
                                    <img
                                      src={item.url}
                                      alt={item.name}
                                      className='h-full w-full object-cover object-center'
                                    />
                                  </div>

                                  <div className='ml-4 flex flex-1 flex-col'>
                                    <div>
                                      <div className='flex justify-between text-base font-medium text-gray-900'>
                                        <h3>
                                          <p>{item.name}</p>
                                        </h3>
                                        <p className='ml-4'>${item.price.toFixed(2)}/min</p>
                                      </div>
                                      <p className='mt-1 text-sm text-gray-500'>
                                        {item.categories.map((c) => capitalize(c)).join(', ')}
                                      </p>
                                    </div>
                                    <div className='flex flex-1 items-end justify-between text-sm'>
                                      <p className='text-gray-500'>{thisItem?.quantity} minutes</p>

                                      <div className='flex'>
                                        <button
                                          type='button'
                                          onClick={() => removeFromCart(item.id)}
                                          className='font-medium text-indigo-600 hover:text-indigo-500'>
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>



                    <div className='border-t border-gray-200 py-2 px-4 sm:px-6'>

                    <form className="mb-2" onSubmit={(event) => handleCheckOut(event)}>
                        <h2 className='flex justify-between text-base font-medium text-gray-900'>Cutomer Details</h2>
                        
                        <input 
                            className='p-2 border-2 rounded-md my-1 w-full border-gray-200 '
                            type="text" 
                            required
                            placeholder="Name" 
                            value={nameCustomer} 
                            name="Name" 
                            onChange={ev => setNameCustomer(ev.target.value)}/>

                        <input 
                            className='p-2 border-2 rounded-md my-1 w-full border-gray-200 '
                            type="email" 
                            required
                            placeholder="Email" 
                            value={emailCustomer} 
                            name="email" 
                            onChange={ev => setEmailCustomer(ev.target.value)}/>

                        <input 
                            className='p-2 border-2 rounded-md my-1 w-full border-gray-200'
                            type="tel"
                            required
                            placeholder="Phone" 
                            value={phoneCustomer} 
                            name="Phone" 
                            onChange={ev => setPhoneCustomer(ev.target.value)}/>
                            
                      <div className='flex justify-between my-2 text-gray-900'>
                        <p>Time</p>
                        <p>{minutes} minutes</p>
                      </div>

                      <div className='flex justify-between text-base font-medium text-gray-900'>
                        <p>Total</p>
                        <p>${total}</p>
                      </div>
                      <div className='mt-6'>
                        
                        <button
                          type="submit"
                          className='flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700'>
                          {isLoading ? <Spinner /> : 'Checkout'}
                        </button>
                      </div>
                    
                    </form>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default Cart
