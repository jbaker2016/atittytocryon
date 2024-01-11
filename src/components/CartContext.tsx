import { useContext, type Dispatch, type FC, type SetStateAction, createContext } from 'react'

export const CartContext = createContext<{ id: string; quantity: number }[]>([]);

export const setOpen = createContext<Dispatch<SetStateAction<boolean>>>(() => {});

export const showCart = createContext<Dispatch<SetStateAction<boolean>>>(() => {});