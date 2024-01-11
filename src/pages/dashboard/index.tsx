import Link from "next/link";
import { FC } from "react";

interface dashboardProps {
    
}
 
const dashboard: FC<dashboardProps> = () => {


    return ( 
        <div className="flex h-screen w-full items-center justify-center gap-8 font-medium">
            <Link className="p-2 bg-gray-100 rounded-md" href='/dashboard/opening'>Open Hours</Link>
            <Link className="p-2 bg-gray-100 rounded-md" href='/dashboard/menu'>Menu</Link>
            <Link className="p-2 bg-gray-100 rounded-md" href='/dashboard/reservations'>Reservations</Link>
        </div> 
        
        );
}
 
export default dashboard; 