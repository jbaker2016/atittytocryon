import { type Dispatch, type FC, type SetStateAction } from 'react'
import CartIcon from './CartIcon';

interface HeaderProps { }
 
const Header: FC<HeaderProps> = () => {
    return ( 
        <div className="flex bg-gray-100">
            <a href="/"><img className="max-h-28 p-4" src="../Krieger_logo.svg" alt="" /></a>
            
            <CartIcon />
        </div>
     );
}
 
export default Header;