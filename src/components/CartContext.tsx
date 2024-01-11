import { type Dispatch, type SetStateAction, createContext } from 'react'

export const CartContext = createContext<{ id: string; quantity: number }[]>([]);

export const setOpen = createContext<Dispatch<SetStateAction<boolean>>>(() => {});