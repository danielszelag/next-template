'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageLayout from '@/components/page-layout'
import BookingCalendar from '@/components/booking-calendar'

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [selectedAddress, setSelectedAddress] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const timeSlots = [
    '09:00',
    '10:00', 
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00'
  ]

  const mockAddresses = [
    { id: 'address-1', name: 'Mieszkanie na Mokotowie' },
    { id: 'address-2', name: 'Biuro w Śródmieściu' },
    { id: 'address-3', name: 'Dom w Wilanowie' }
  ]

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !selectedAddress) {
      alert('Proszę wypełnić wszystkie pola')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate.toISOString().split('T')[0],
          time: selectedTime,
          addressId: selectedAddress,
          serviceType: 'standard',
          notes: ''
        }),
      })

      if (response.ok) {
        // Redirect to dashboard after successful booking
        router.push('/dashboard')
      } else {
        alert('Błąd podczas rezerwacji. Spróbuj ponownie.')
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Błąd podczas rezerwacji. Spróbuj ponownie.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageLayout>
      <div className='bg-blue-50/20 min-h-screen -mx-6 px-6'>
        <div className='max-w-4xl mx-auto pt-8'>
          <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
            <h1 className='text-2xl font-bold text-gray-900 mb-6'>
              Zarezerwuj sprzątanie
            </h1>
            
            {/* Address Selection */}
            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Wybierz adres
              </label>
              <select
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value=''>Wybierz adres...</option>
                {mockAddresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {address.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Calendar */}
            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Wybierz datę
              </label>
              <BookingCalendar onDateSelect={setSelectedDate} />
              {selectedDate && (
                <p className='mt-2 text-sm text-gray-600'>
                  Wybrana data: {selectedDate.toLocaleDateString('pl-PL')}
                </p>
              )}
            </div>

            {/* Time Selection */}
            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Wybierz godzinę
              </label>
              <div className='grid grid-cols-3 sm:grid-cols-5 gap-2'>
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-2 text-sm font-medium rounded-lg border transition-colors ${
                      selectedTime === time
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleBooking}
              disabled={!selectedDate || !selectedTime || !selectedAddress || isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                selectedDate && selectedTime && selectedAddress && !isSubmitting
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Rezerwuję...' : 'Zarezerwuj sprzątanie'}
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
