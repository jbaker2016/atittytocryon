import type { Day } from '@prisma/client'
import { addMinutes, differenceInHours, format, formatISO, isAfter, isBefore, parse } from 'date-fns'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { type FC, useEffect, useState } from 'react'
import { appointmentBuffer, now, OPENING_HOURS_INTERVAL } from 'src/constants/config'
import { getOpeningTimes, roundToNearestMinutes } from 'src/utils/helpers'
import type { DateTime } from 'src/utils/types'
import { trpc } from '~/utils/trpc'

const DynamicCalendar = dynamic(() => import('react-calendar'), { ssr: false })

interface CalendarProps {
  days: Day[]
  closedDays: string[] // as ISO strings
}

const CalendarComponent: FC<CalendarProps> = ({ days, closedDays }) => {
  const router = useRouter()

  // Determine if today is closed
  const today = days.find((d) => d.dayOfWeek === now.getDay())
  const rounded = roundToNearestMinutes(now, OPENING_HOURS_INTERVAL)
  const closing = parse(today!.closeTime, 'kk:mm', now)
  const tooLate = !isBefore(rounded, closing)
  if (tooLate) closedDays.push(formatISO(new Date().setHours(0, 0, 0, 0)))

  const [date, setDate] = useState<DateTime>({
    justDate: null,
    dateTime: null,
  })

  useEffect(() => {
    if (date.dateTime) {
      localStorage.setItem('selectedTime', date.dateTime.toISOString())
      router.push('/menu')
    }
  }, [date.dateTime, router])

  let times = date.justDate && getOpeningTimes(date.justDate, days) || undefined

  const { data: reservations } = trpc.reservation.getReservedTimes.useQuery()


  reservations?.forEach(reservation => {

    if (reservation.selectedTime != "") {
      const timeStart = addMinutes(new Date(reservation.selectedTime), -appointmentBuffer)
      const timeEnd =  addMinutes(reservation.selectedTime, Number(reservation.minutes)-1)
      times = times?.filter(time => (isBefore(time,timeStart) || isAfter(time, timeEnd)))
    }

  });

  console.log(closedDays)

  return (
    <div className='flex h-screen flex-col px-4 items-center mt-8 justify-top'>
      <h1 className='mb-2'>Book your appointment now!</h1>
      {date.justDate ? (
        <div className='flex max-w-lg flex-wrap items-center gap-4'>
          {times?.map((time, i) => (
            <div className='rounded-sm bg-gray-100 p-2' key={`time-${i}`}>
              <button className='w-16'onClick={() => setDate((prev) => ({ ...prev, dateTime: time }))} type='button'>
                {format(time, 'h:mmaaaaa')}m
              </button>
            </div>
          ))}
        </div>
      ) : (
        <DynamicCalendar
          minDate={now}
          className='REACT-CALENDAR p-2'
          view='month'
          tileDisabled={({ date }) => closedDays.includes(formatISO(date.setHours(0, 0, 0, 0)))}
          //tileDisabled={({ date }) => date === date}
          onClickDay={(date) => setDate((prev) => ({ ...prev, justDate: date }))}
        />
      )}
    </div>
  )
}

export default CalendarComponent