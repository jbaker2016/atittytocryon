import { useContext, type Dispatch, type FC, type SetStateAction, createContext, ReactNode, useState, useEffect } from 'react'
import { cartInterval, cartMinimum } from '~/constants/config';
import Cart from './Cart';
import { useLocalStorage } from '~/hooks/useLocalStorage';


type ShoppingCartProviderProps = {
  children: ReactNode
}

type ProductsInCart = {
  id: string
  quantity: number
}

type ShoppingCartContext = {
    openCart: () => void
    closeCart: () => void
    showCart: boolean
    showPopup: boolean
    productsInCart: ProductsInCart[]
    addToCart: (id: string, quantity: number) => void
    removeFromCart: (id: string) => void
    clearCart: () => void
}


const ShoppingCartContext = createContext({} as ShoppingCartContext)

export function useShoppingCart() {
  return useContext(ShoppingCartContext)
}
export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [showCart, setShowCart] = useState<boolean>(false)

    
    const ls = typeof window !== "undefined" ? window.localStorage : null;

    const [productsInCart, setProductsInCart] = useLocalStorage<ProductsInCart[]>(
      "shopping-cart", 
      []
    )

    useEffect(() => {
        if (showPopup === true){
          const timer = setTimeout(() => {
            setShowPopup(false)
          }, 500);
          return () => clearTimeout(timer);
        }
    }, [showPopup])

    const openCart = () => setShowCart(true)
    const closeCart = () => setShowCart(false)

    const addToCart = (id: string, quantity: number) => {
      setShowPopup(true);
  
      setProductsInCart((prev: ProductsInCart[]) => {
        const existing = prev.find((item) => item.id === id)
        if (existing) {
          return prev.map((item) => {
            if (item.id === id) return { ...item, quantity: item.quantity + quantity * cartInterval }
            return item
          })
        }

        if (productsInCart.length > 0){
          return [...prev, { id, quantity: cartInterval }]
        } else {
          return [...prev, { id, quantity: cartMinimum }]
        }
        
      })
    }
    
    let selectedTime = ''

    if (typeof window !== 'undefined') {
        selectedTime = localStorage.getItem('selectedTime')||''
    }

    const removeFromCart = (id: string) => {
      setProductsInCart((prev: ProductsInCart[]) => prev.filter((item) => item.id !== id))
    }

    const clearCart = () => {
      setProductsInCart([])
    }


  return (
    <ShoppingCartContext.Provider
      value={{
        openCart, 
        closeCart,
        showCart,
        showPopup,
        productsInCart,
        addToCart, 
        removeFromCart,
        clearCart
      }}
    >
      {children}

      {/* <Cart selectedTime={selectedTime}/> */}

    </ShoppingCartContext.Provider>
  )
}