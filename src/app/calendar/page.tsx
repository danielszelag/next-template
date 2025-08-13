'use client'

import { useState } from 'react'
import PageLayout from '@/components/page-layout'

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [step, setStep] = useState<'date' | 'time' | 'confirm'>('date')
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const months = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ]

  const timeSlots = [
    { time: '09:00', available: true },
    { time: '10:00', available: false },
    { time: '11:00', available: true },
    { time: '12:00', available: true },
    { time: '13:00', available: false },
    { time: '14:00', available: true },
    { time: '15:00', available: true },
    { time: '16:00', available: true },
    { time: '17:00', available: false }
  ]

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
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
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return date.toISOString().split('T')[0]
  }

  const isDateDisabled = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr)
    setStep('time')
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setStep('confirm')
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>)
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
      <div className="max-w-3xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-4">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setStep('date')}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 cursor-pointer hover:scale-105 ${
                step === 'date' ? 'bg-blue-500 text-white' 
                : selectedDate ? 'bg-green-500 text-white border-2 border-green-400' 
                : 'bg-gray-200 text-gray-600'
              }`}
            >
              {selectedDate && step !== 'date' ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                '1'
              )}
            </button>
            <div className="h-1 w-20 bg-gray-200 transition-all duration-300"></div>
            <button
              onClick={() => selectedDate && setStep('time')}
              disabled={!selectedDate}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                !selectedDate ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'
              } ${
                step === 'time' ? 'bg-blue-500 text-white' 
                : selectedTime ? 'bg-green-500 text-white border-2 border-green-400'
                : selectedDate ? 'bg-blue-100 text-blue-600 border-2 border-blue-300'
                : 'bg-gray-200 text-gray-600'
              }`}
            >
              {selectedTime && step !== 'time' ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                '2'
              )}
            </button>
            <div className="h-1 w-20 bg-gray-200 transition-all duration-300"></div>
            <button
              onClick={() => selectedTime && setStep('confirm')}
              disabled={!selectedTime}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                !selectedTime ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'
              } ${
                step === 'confirm' ? 'bg-blue-500 text-white' 
                : selectedTime ? 'bg-blue-100 text-blue-600 border-2 border-blue-300'
                : 'bg-gray-200 text-gray-600'
              }`}
            >
              3
            </button>
          </div>
          <div className="flex items-center justify-center space-x-4 mt-2 text-sm">
            <div className="w-8 flex justify-center">
              <span className="text-gray-600">
                Data
              </span>
            </div>
            <div className="w-20"></div>
            <div className="w-8 flex justify-center">
              <span className="text-gray-600">
                Godzina
              </span>
            </div>
            <div className="w-20"></div>
            <div className="w-8 flex justify-center">
              <span className="text-gray-600">
                Potwierdź
              </span>
            </div>
          </div>
        </div>

        {/* Date selection */}
        {step === 'date' && (
          <div className="bg-white rounded-2xl shadow-lg p-4">
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
              {['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day.slice(0, 3)}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {renderCalendar()}
            </div>
          </div>
        )}

        {/* Time selection */}
        {step === 'time' && (
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => {
                  setStep('date')
                  setSelectedTime(null) // Reset time selection when going back
                }}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Wróć
              </button>
              <div></div>
              <div></div>
            </div>

            <div className="text-center mb-4">
              <p className="text-lg text-gray-600">
                Data: <span className="font-semibold text-blue-600">{selectedDate}</span>
              </p>
            </div>

            <div className="space-y-3 max-w-sm mx-auto">
              {timeSlots.map(slot => (
                <button
                  key={slot.time}
                  onClick={() => slot.available && handleTimeSelect(slot.time)}
                  disabled={!slot.available}
                  className={`w-full p-4 rounded-lg text-left transition-all duration-200 flex items-center justify-between ${
                    selectedTime === slot.time
                      ? 'bg-blue-500 text-white shadow-md'
                      : slot.available
                      ? 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                  }`}
                >
                  <span className="text-lg font-medium">{slot.time}</span>
                  {!slot.available && (
                    <span className="text-sm text-gray-500">Zajęte</span>
                  )}
                  {selectedTime === slot.time && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Confirmation */}
        {step === 'confirm' && (
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <h1 className="text-3xl font-light text-gray-900 mb-4 text-center">
              Potwierdź rezerwację
            </h1>

            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-900 mb-2">
                  {selectedDate}
                </div>
                <div className="text-xl text-blue-700">
                  {selectedTime}
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setStep('time')}
                className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Wróć
              </button>
              <button
                onClick={() => alert('Rezerwacja potwierdzona!')}
                className="flex-1 bg-blue-500 text-white py-4 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
              >
                Potwierdź rezerwację
              </button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
