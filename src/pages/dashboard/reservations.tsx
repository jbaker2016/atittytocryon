import { FC } from "react";
import { trpc } from "~/utils/trpc";
import { format, parseISO } from 'date-fns'

interface reservationsProps {
    
}
 
const reservations: FC<reservationsProps> = () => {

    const { data: reservations, refetch } = trpc.reservation.getReservations.useQuery()
    const { mutateAsync: deleteReservation } = trpc.reservation.deleteReservation.useMutation()


    const handleDelete = async (id: string) => {
        await deleteReservation( { id } )
        refetch()
      }

    return ( 
        <div className="p-4">
            <h1>Orders</h1> 
            <table className="w-full mt-4 text-xs text-gray-500 border border-gray-300 px-4 py-2">
                <thead className="border-y text-gray-900">
                    <tr className="">
                        <td> </td>
                        <td>Created</td>
                        <td>Customer</td>
                        <td>Scheduled</td>
                        <td>Cost</td>
                        <td>Minutes</td>
                    </tr>
                </thead>

                <tbody>
                {(reservations?.length || 0) > 0 && reservations?.map(reservation => ( reservation.paid && (
                    <tr key={reservation.id}>
                        <td>
                            <button 
                                className="text-red-200 px-2" 
                                onClick={() => handleDelete(reservation.id)}>
                                ❌
                            </button>
                        </td>
                        <td>{(new Date(reservation.createdAt)).toLocaleString()}</td>
                        <td className="py-2">
                            {reservation.nameCustomer} <br />
                            {reservation.emailCustomer} <br />
                            {reservation.phoneCustomer}
                            <br />
                        </td>
                        <td>{(new Date(reservation.selectedTime)).toLocaleString()}</td>
                        <td>${reservation.cost}</td>
                        <td>{reservation.minutes}min</td>
                    </tr>
                )))}
                </tbody>
            </table>
        </div>
     );
}
 
export default reservations;