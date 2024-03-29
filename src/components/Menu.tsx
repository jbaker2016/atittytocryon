import { useRouter } from "next/router";
import { FC, useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { trpc } from "~/utils/trpc";
import Select from 'react-select'
import { capitalize, selectOptions } from "~/utils/helpers";
import Image from "next/image";
import { format, parseISO } from 'date-fns'
import { Button } from '@chakra-ui/react'
import { cartInterval, cartMinimum } from "~/constants/config";

interface MenuProps {
    selectedTime: string // as ISO string
    addToCart: (id: string, quantity: number) => void
    productsInCart: { id: string; quantity: number }[]
}

const Menu: FC<MenuProps> = ({ selectedTime, addToCart, productsInCart }) => {

    const router = useRouter()
    const { data: menuItems } = trpc.menu.getMenuItems.useQuery(undefined, { refetchOnMount: false })
  
    const [filter, setFilter] = useState<string | undefined>(undefined)
  
    const filteredMenuItems = menuItems?.filter((menuItem) => {
      if (!filter) return true
      return menuItem.categories.includes(filter)
    })

    return ( 
        <div className='bg-white'>
        <div className='mx-auto max-w-2xl py-4 px-4 sm:py-8 lg:max-w-full'>
          <div className='flex-col justify-between'>
            <h2 className='flex items-center gap-4 sm:text-2xl font-bold tracking-tight text-gray-900'>
              <HiArrowLeft className='cursor-pointer' onClick={() => router.push('/')} />
              Available options for {format(parseISO(selectedTime), 'MMM do, yyyy')}
            </h2>
            <Select
              onChange={(e) => {
                if (e?.value === 'all') setFilter(undefined)
                else setFilter(e?.value)
              }}
              className='border-none outline-none w-60 my-4'
              placeholder='Filter by...'
              options={selectOptions}
            />
          </div>
  
          <div className='mt-6 grid grid-cols-1 lg:grid-cols-2 gap-y-10 gap-x-6 xl:gap-x-8'>
            {filteredMenuItems?.map((menuItem) => (
              <div key={menuItem.id} className='group relative'>
                <div className='min-h-0 aspect-w-1 aspect-h-1 lg:aspect-none w-full overflow-hidden rounded-md bg-gray-200 hover:opacity-75 lg:h-60 lg:w-120'>
                  <div className='relative h-full w-full object-cover object-center lg:h-full lg:w-full'>
                    <img src={menuItem.url} alt={menuItem.name} style={{ objectFit: 'cover' }} />
                  </div>
                </div>
                <div className='mt-4 flex justify-between'>
                  <div>
                    <h3 className='text-sm text-gray-700'>
                      <p>{menuItem.name}</p>
                    </h3>
                    <p className='mt-1 text-sm text-gray-500'>
                      {menuItem.categories.map((c) => capitalize(c)).join(', ')}
                    </p>
                  </div>
                  <p className='text-sm font-medium text-gray-900'>${menuItem.price.toFixed(2)}/min</p>
                </div>

                {productsInCart.length > 0 ? (
                  <Button
                    className='mt-4'
                    onClick={() => {addToCart(menuItem.id, 1)}}
                    >
                    Add {cartInterval} minutes
                  </Button>

                ) : (
                  <Button
                    className='mt-4'
                    onClick={() => {addToCart(menuItem.id, 1)}}
                    >
                    Add {cartMinimum} minutes
                  </Button>
                )}
                
              </div>
            ))}
          </div>
        </div>
      </div>
     );
}
 
export default Menu;