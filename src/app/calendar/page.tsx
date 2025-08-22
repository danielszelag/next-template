'use client'

import { useState, useEffect } from 'react'
import PageLayout from '@/components/page-layout'
import type { Address } from '@/types/api'

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const [openSection, setOpenSection] = useState<
    'date' | 'time' | 'address' | null
  >('date')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([])
  const [loadingAddresses, setLoadingAddresses] = useState(true)

  // Fetch addresses from API
  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/addresses')
      if (response.ok) {
        const data = (await response.json()) as Address[]
        setSavedAddresses(data)
      } else {
        console.error('Failed to fetch addresses')
        setSavedAddresses([])
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
      setSavedAddresses([])
    } finally {
      setLoadingAddresses(false)
    }
  }

  // Load addresses on component mount
  useEffect(() => {
    fetchAddresses()
  }, [])

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
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth() + 1
    const formattedMonth = month.toString().padStart(2, '0')
    const formattedDay = day.toString().padStart(2, '0')
    return `${year}-${formattedMonth}-${formattedDay}`
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
    // Brief delay to show the selection feedback before transitioning
    setTimeout(() => {
      setOpenSection('time')
    }, 100) // 100ms delay to show the selected date
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    // Brief delay to show the selection feedback before transitioning to address
    setTimeout(() => {
      setOpenSection('address')
    }, 100) // 100ms delay to show the selected time
  }

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddress(addressId)
    // Brief delay to show the selection feedback before closing accordion
    setTimeout(() => {
      setOpenSection(null)
    }, 100) // 100ms delay to show the selected address
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
          className={`h-12 w-full rounded-lg text-lg font-semibold transition-colors border ${
            isSelected
              ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
              : isDisabled
              ? 'text-gray-300 cursor-not-allowed border-transparent'
              : 'text-gray-700 border-transparent hover:bg-gray-50 hover:border-gray-300'
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
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
            <button
              onClick={() =>
                setOpenSection(openSection === 'date' ? null : 'date')
              }
              className='w-full p-4 text-left'
            >
              <div className='flex items-center justify-between'>
                <h3 className='text-xl font-semibold text-gray-900'>Data</h3>
                <span
                  className={`text-lg font-semibold ${
                    selectedDate ? 'text-gray-800' : 'text-gray-500'
                  }`}
                >
                  {formatDisplayDate(selectedDate) || 'dd.mm.yyyy'}
                </span>
              </div>
            </button>
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                openSection === 'date'
                  ? 'max-h-[500px] opacity-100'
                  : 'max-h-0 opacity-0'
              }`}
            >
              <div className='p-6 bg-gray-50'>
                {/* Calendar Content */}
                <div className='flex items-center justify-between mb-4'>
                  <button
                    onClick={() => navigateMonth('prev')}
                    className='p-3 hover:bg-gray-100 rounded-full transition-colors'
                  >
                    <svg
                      className='w-6 h-6 text-gray-600'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15 19l-7-7 7-7'
                      />
                    </svg>
                  </button>
                  <h2 className='text-2xl font-semibold text-gray-900 whitespace-nowrap'>
                    {months[currentMonth.getMonth()]}{' '}
                    {currentMonth.getFullYear()}
                  </h2>
                  <button
                    onClick={() => navigateMonth('next')}
                    className='p-3 hover:bg-gray-100 rounded-full transition-colors'
                  >
                    <svg
                      className='w-6 h-6 text-gray-600'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </button>
                </div>
                <div className='grid grid-cols-7 gap-2 mb-2'>
                  {['N', 'P', 'W', 'Ś', 'C', 'P', 'S'].map((day, i) => (
                    <div
                      key={i}
                      className='text-center text-sm font-medium text-gray-500 py-2'
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <div className='grid grid-cols-7 gap-2'>{renderCalendar()}</div>
              </div>
            </div>
          </div>

          {/* Time Accordion */}
          <div
            className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${
              !selectedDate ? 'opacity-50' : ''
            }`}
          >
            <button
              onClick={() =>
                selectedDate &&
                setOpenSection(openSection === 'time' ? null : 'time')
              }
              disabled={!selectedDate}
              className='w-full p-4 text-left'
            >
              <div className='flex items-center justify-between'>
                <h3 className='text-xl font-semibold text-gray-900'>Godzina</h3>
                <span
                  className={`text-lg font-semibold ${
                    selectedTime ? 'text-gray-800' : 'text-gray-500'
                  }`}
                >
                  {selectedTime || '--:--'}
                </span>
              </div>
            </button>
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                openSection === 'time'
                  ? 'max-h-96 opacity-100'
                  : 'max-h-0 opacity-0'
              }`}
            >
              <div className='p-6 bg-gray-50'>
                {/* Time Slot Content */}
                <div className='grid grid-cols-3 gap-3 max-w-sm mx-auto'>
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() =>
                        slot.available && handleTimeSelect(slot.time)
                      }
                      disabled={!slot.available}
                      className={`p-4 rounded-lg transition-colors flex items-center justify-center border min-h-[60px] ${
                        selectedTime === slot.time
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                          : slot.available
                          ? 'bg-white text-gray-900 hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                      }`}
                    >
                      <span className='text-lg font-medium'>{slot.time}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Address Accordion */}
          <div
            className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${
              !selectedDate || !selectedTime ? 'opacity-50' : ''
            }`}
          >
            <button
              onClick={() =>
                selectedDate &&
                selectedTime &&
                setOpenSection(openSection === 'address' ? null : 'address')
              }
              disabled={!selectedDate || !selectedTime}
              className='w-full p-4 text-left'
            >
              <div className='flex items-center justify-between'>
                <h3 className='text-xl font-semibold text-gray-900'>Lokacja</h3>
                <span
                  className={`text-lg font-semibold ${
                    selectedAddress ? 'text-gray-800' : 'text-gray-500'
                  }`}
                >
                  {selectedAddress
                    ? savedAddresses.find((addr) => addr.id === selectedAddress)
                        ?.name || 'Wybierz lokację'
                    : 'Wybierz lokację'}
                </span>
              </div>
            </button>
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                openSection === 'address'
                  ? 'max-h-96 opacity-100'
                  : 'max-h-0 opacity-0'
              }`}
            >
              <div className='p-6 bg-gray-50'>
                {loadingAddresses ? (
                  <div className='flex justify-center py-8'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500'></div>
                  </div>
                ) : savedAddresses.length > 0 ? (
                  <div className='space-y-3'>
                    {savedAddresses.map((address) => (
                      <button
                        key={address.id}
                        onClick={() => handleAddressSelect(address.id)}
                        className={`w-full p-4 rounded-lg transition-colors text-left border ${
                          selectedAddress === address.id
                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                            : 'bg-white text-gray-900 hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className='flex justify-between items-center'>
                          <div className='font-bold text-lg'>
                            {address.name}
                          </div>
                          <div className='text-right'>
                            <div
                              className={`text-sm ${
                                selectedAddress === address.id
                                  ? 'text-emerald-100'
                                  : 'text-gray-600'
                              }`}
                            >
                              {address.street}
                            </div>
                            <div
                              className={`text-sm ${
                                selectedAddress === address.id
                                  ? 'text-emerald-100'
                                  : 'text-gray-600'
                              }`}
                            >
                              {address.postalCode} {address.city}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className='text-center'>
                    <div className='text-gray-500 text-lg mb-6'>
                      Brak zapisanych adresów
                    </div>
                    <a
                      href='/account?section=addresses'
                      className='inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors'
                    >
                      <svg
                        className='w-4 h-4 mr-2'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                        />
                      </svg>
                      Dodaj adres
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col-reverse sm:flex-row gap-4'>
            <a
              href='/dashboard'
              className='w-full sm:w-1/2 px-6 py-4 border border-gray-200 bg-white text-gray-700 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-all duration-300 text-center flex items-center justify-center'
            >
              <svg
                className='w-5 h-5 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 19l-7-7 7-7'
                />
              </svg>
              Wróć
            </a>
            <button
              onClick={() => alert('Rezerwacja potwierdzona!')}
              disabled={!selectedDate || !selectedTime || !selectedAddress}
              className={`w-full sm:w-1/2 p-4 rounded-lg text-lg font-semibold transition-all duration-300 ${
                !selectedDate || !selectedTime || !selectedAddress
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm'
              }`}
            >
              Rezerwuj
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
