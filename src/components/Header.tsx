import { FC } from "react";
import CartIcon from '@components/CartIcon'

interface HeaderProps {
    
}
 
const Header: FC<HeaderProps> = () => {
    return ( 
        <div className="flex py-4 align-bottom bg-pink-100">
            <img className="h-20 p-1" src="../Krieger_logo.svg" alt="" />
            
        </div>
     );
}
 
export default Header;