'use client'

import { useState } from 'react'

interface BookingCalendarProps {
  onDateSelect?: (date: Date, timeSlot: string) => void
}

export default function BookingCalendar({ onDateSelect }: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('')

  const timeSlots = [
    '8:00', '9:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ]

  const daysOfWeek = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nie']
  const months = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7 // Convert to Monday = 0

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }

  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false
    return date.toDateString() === selectedDate.toDateString()
  }

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return
    setSelectedDate(date)
    setSelectedTimeSlot('')
  }

  const handleTimeSlotClick = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot)
    if (selectedDate && onDateSelect) {
      onDateSelect(selectedDate, timeSlot)
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const days = getDaysInMonth(currentDate)

  return (
    <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-200'>
      <div className='mb-6'>
        <h3 className='text-xl font-semibold text-gray-900 mb-2'>
          Wybierz termin
        </h3>
        <p className='text-gray-600'>
          Zarezerwuj dogodny dla Ciebie termin sprzątania
        </p>
      </div>

      {/* Calendar Header */}
      <div className='flex items-center justify-between mb-6'>
        <button
          onClick={() => navigateMonth('prev')}
          className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
        >
          <svg className='w-5 h-5 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
          </svg>
        </button>
        
        <h4 className='text-lg font-semibold text-gray-900'>
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h4>
        
        <button
          onClick={() => navigateMonth('next')}
          className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
        >
          <svg className='w-5 h-5 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
          </svg>
        </button>
      </div>

      {/* Days of Week */}
      <div className='grid grid-cols-7 gap-1 mb-2'>
        {daysOfWeek.map((day) => (
          <div key={day} className='p-2 text-center text-sm font-medium text-gray-500'>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className='grid grid-cols-7 gap-1 mb-6'>
        {days.map((day, index) => (
          <div key={index} className='aspect-square'>
            {day && (
              <button
                onClick={() => handleDateClick(day)}
                disabled={isDateDisabled(day)}
                className={`w-full h-full flex items-center justify-center text-sm rounded-lg transition-all duration-200 ${
                  isDateDisabled(day)
                    ? 'text-gray-300 cursor-not-allowed'
                    : isDateSelected(day)
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                {day.getDate()}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className='border-t pt-6'>
          <h4 className='text-lg font-semibold text-gray-900 mb-4'>
            Dostępne godziny - {selectedDate.toLocaleDateString('pl-PL')}
          </h4>
          <div className='grid grid-cols-3 sm:grid-cols-5 gap-3'>
            {timeSlots.map((timeSlot) => (
              <button
                key={timeSlot}
                onClick={() => handleTimeSlotClick(timeSlot)}
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedTimeSlot === timeSlot
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-200 hover:border-green-300'
                }`}
              >
                {timeSlot}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation */}
      {selectedDate && selectedTimeSlot && (
        <div className='mt-6 p-4 bg-green-50 border border-green-200 rounded-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <h5 className='font-semibold text-green-900'>Wybrany termin:</h5>
              <p className='text-green-700'>
                {selectedDate.toLocaleDateString('pl-PL')} o {selectedTimeSlot}
              </p>
            </div>
            <button className='bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors'>
              Potwierdź rezerwację
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
