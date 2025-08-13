'use client'

import { useState } from 'react'
import PageLayout from '@/components/page-layout'

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [openSection, setOpenSection] = useState<'date' | 'time' | null>('date')
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const months = [
    'Styczeń',
    'Luty',
    'Marzec',
    'Kwiecień',
    'Maj',
    'Czerwiec',
    'Lipiec',
    'Sierpień',
    'Wrzesień',
    'Październik',
    'Listopad',
    'Grudzień',
  ]

  const timeSlots = [
    { time: '07:00', available: true },
    { time: '08:00', available: true },
    { time: '09:00', available: true },
    { time: '10:00', available: false },
    { time: '11:00', available: true },
    { time: '12:00', available: true },
    { time: '13:00', available: false },
    { time: '14:00', available: true },
    { time: '15:00', available: true },
    { time: '16:00', available: true },
    { time: '17:00', available: false },
    { time: '18:00', available: true },
  ]

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev)
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  const formatDate = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    )
    return date.toISOString().split('T')[0]
  }

  const isDateDisabled = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    )
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr)
    setOpenSection('time')
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setOpenSection(null)
  }

  const formatDisplayDate = (dateStr: string | null) => {
    if (!dateStr) return null
    const [year, month, day] = dateStr.split('-')
    return `${day}.${month}.${year}`
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className='h-12'></div>)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(day)
      const isDisabled = isDateDisabled(day)
      const isSelected = selectedDate === dateStr

      days.push(
        <button
          key={day}
          onClick={() => !isDisabled && handleDateSelect(dateStr)}
          disabled={isDisabled}
          className={`h-12 w-full rounded-xl text-lg font-semibold transition-all duration-300 ${
            isSelected
              ? 'bg-blue-500 text-white shadow-lg transform scale-105'
              : isDisabled
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md'
          }`}
        >
          {day}
        </button>
      )
    }

    return days
  }

  return (
    <PageLayout>
      <div className='max-w-2xl mx-auto'>
        <div className='space-y-4'>
          {/* Date Accordion */}
          <div className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden'>
            <button
              onClick={() => setOpenSection(openSection === 'date' ? null : 'date')}
              className='w-full p-6 text-left'
            >
              <div className='flex items-center justify-between'>
                <h3 className='text-xl font-semibold text-gray-900'>Data</h3>
                <span className={`text-lg font-semibold ${selectedDate ? 'text-gray-800' : 'text-gray-500'}`}>
                  {formatDisplayDate(selectedDate) || 'Wybierz...'}
                </span>
              </div>
            </button>
            {openSection === 'date' && (
              <div className='p-6 bg-gray-50'>
                {/* Calendar Content */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </h2>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['N', 'P', 'W', 'Ś', 'C', 'P', 'S'].map((day, i) => (
                    <div key={i} className="text-center text-sm font-medium text-gray-500 py-2">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
              </div>
            )}
          </div>

          {/* Time Accordion */}
          <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden ${!selectedDate ? 'opacity-50' : ''}`}>
            <button
              onClick={() => selectedDate && setOpenSection(openSection === 'time' ? null : 'time')}
              disabled={!selectedDate}
              className='w-full p-6 text-left'
            >
              <div className='flex items-center justify-between'>
                <h3 className='text-xl font-semibold text-gray-900'>Godzina</h3>
                <span className={`text-lg font-semibold ${selectedTime ? 'text-gray-800' : 'text-gray-500'}`}>
                  {selectedTime || 'Wybierz...'}
                </span>
              </div>
            </button>
            {openSection === 'time' && (
              <div className='p-6 bg-gray-50'>
                {/* Time Slot Content */}
                <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => slot.available && handleTimeSelect(slot.time)}
                      disabled={!slot.available}
                      className={`p-4 rounded-lg transition-all duration-200 flex flex-col items-center justify-center ${
                        selectedTime === slot.time
                          ? 'bg-blue-500 text-white shadow-md'
                          : slot.available
                          ? 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                      }`}
                    >
                      <span className='text-lg font-medium'>{slot.time}</span>
                      {!slot.available && (
                        <span className='text-xs mt-1 text-gray-500'>Zajęte</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirmation Button */}
          <button
            onClick={() => alert('Rezerwacja potwierdzona!')}
            disabled={!selectedDate || !selectedTime}
            className={`w-full p-6 rounded-2xl text-xl font-semibold transition-all duration-300 ${
              !selectedDate || !selectedTime
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg'
            }`}
          >
            Potwierdź Wybór
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
