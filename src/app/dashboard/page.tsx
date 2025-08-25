'use client'

import { useUser } from '@clerk/nextjs'
import { SignInButton } from '@clerk/nextjs'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import PageLayout from '@/components/page-layout'
import RecordingsGallery from '@/components/recordings-gallery'
import { mockCleaningSessions } from '@/db/mock-data'
import VideoIcon from '@/components/icons/VideoIcon'
import ChartBarIcon from '@/components/icons/ChartBarIcon'
import ClockIcon from '@/components/icons/ClockIcon'
import type { CleaningSession } from '@/db/schema'

type BookingWithAddress = CleaningSession & {
  addressName?: string
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [openSections, setOpenSections] = useState<{[key: string]: boolean}>({
    overview: false,
    recent: true,
    recordings: true,
    stats: false,
  })
  const [nextBooking, setNextBooking] = useState<BookingWithAddress | null>(null)
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [historyBookings, setHistoryBookings] = useState<BookingWithAddress[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [showCancelModal, setShowCancelModal] = useState(false)

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

    // Fetch next upcoming booking
  const fetchNextBooking = useCallback(async () => {
    if (!user?.id) return
    
    try {
      const response = await fetch('/api/bookings')
      if (response.ok) {
        const bookings = await response.json() as BookingWithAddress[]
        // Find the next upcoming booking (scheduled status and future date)
        const upcoming = bookings
          .filter(booking => {
            const bookingDate = new Date(booking.scheduledTime || 0)
            const now = new Date()
            return booking.status === 'scheduled' && bookingDate > now
          })
          .sort((a, b) => {
            const dateA = new Date(a.scheduledTime || 0).getTime()
            const dateB = new Date(b.scheduledTime || 0).getTime()
            return dateA - dateB
          })
        
        setNextBooking(upcoming.length > 0 ? upcoming[0] : null)

        // Set history bookings (completed and past scheduled ones)
        const history = bookings
          .filter(booking => {
            const bookingDate = new Date(booking.scheduledTime || 0)
            const now = new Date()
            return booking.status === 'completed' || 
                   (booking.status === 'scheduled' && bookingDate <= now)
          })
          .sort((a, b) => {
            const dateA = new Date(a.scheduledTime || 0).getTime()
            const dateB = new Date(b.scheduledTime || 0).getTime()
            return dateB - dateA // Latest first
          })
        
        setHistoryBookings(history)
      } else {
        setNextBooking(null)
        setHistoryBookings([])
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setNextBooking(null)
      setHistoryBookings([])
    } finally {
      setLoadingBookings(false)
      setLoadingHistory(false)
    }
  }, [user?.id])

  // Fetch bookings when component mounts or user changes
  useEffect(() => {
    if (user?.id) {
      fetchNextBooking()
    }
  }, [user?.id, fetchNextBooking])

  const handleCancelBooking = () => {
    setShowCancelModal(true)
  }

  const handleCancelConfirm = async () => {
    if (!nextBooking) return
    
    try {
      // Tu będzie API call do usunięcia bookingu
      console.log('Cancelling booking:', nextBooking.id)
      
      // Odśwież dane po usunięciu
      await fetchNextBooking()
      setShowCancelModal(false)
    } catch (error) {
      console.error('Failed to cancel booking:', error)
    }
  }

  const handleCancelModalClose = () => {
    setShowCancelModal(false)
  }

  const handleEditBooking = () => {
    if (!nextBooking) return
    
    // Format date and time for URL parameters
    const scheduledDate = new Date(nextBooking.scheduledTime || 0)
    const dateStr = scheduledDate.toISOString().split('T')[0] // YYYY-MM-DD
    const timeStr = scheduledDate.toTimeString().slice(0, 5) // HH:MM
    
    // Navigate to calendar with current booking data
    const params = new URLSearchParams({
      date: dateStr,
      time: timeStr,
      address: nextBooking.addressId || '',
      bookingId: nextBooking.id,
      editing: 'true'
    })
    
    router.push(`/calendar?${params.toString()}`)
  }

  // Simple, elegant accordion section component
  const AccordionSection = ({
    id,
    title,
    badge,
    icon,
    children,
    defaultOpen = false,
  }: {
    id: string
    title: string | React.ReactNode
    badge?: string
    icon?: React.ReactNode
    children: React.ReactNode
    defaultOpen?: boolean
  }) => {
    const isOpen = openSections[id] ?? defaultOpen

    return (
      <div className='border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-4'>
        <button
          onClick={() => toggleSection(id)}
          className='w-full px-6 py-4 bg-white hover:bg-gray-50 transition-all duration-200 text-left flex items-center justify-between group'
        >
          <div className='flex items-center space-x-3'>
            {icon && (
              <div
                className={`text-gray-600 transition-colors duration-200 ${
                  isOpen ? 'text-gray-900' : ''
                }`}
              >
                {icon}
              </div>
            )}
            <div>
              <h3
                className={`text-lg font-semibold transition-colors duration-200 ${
                  isOpen ? 'text-gray-900' : 'text-gray-700'
                }`}
              >
                {title}
              </h3>
              {badge && <span className='text-sm text-gray-500'>{badge}</span>}
            </div>
          </div>
          <div
            className={`transition-all duration-300 ease-in-out ${
              isOpen ? 'rotate-180 text-gray-900' : 'text-gray-400'
            }`}
          >
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </div>
        </button>

        <div
          className={`transition-all duration-300 ease-in-out ${
            isOpen ? 'opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
          style={{
            maxHeight: isOpen ? 'none' : '0',
          }}
        >
          <div className='px-6 py-4 bg-gray-50 border-t border-gray-200 transform transition-transform duration-200'>
            {children}
          </div>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <PageLayout>
        <div className='flex justify-center items-center min-h-[60vh]'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900'></div>
        </div>
      </PageLayout>
    )
  }

  if (!user) {
    return (
      <PageLayout>
        <div className='flex items-center justify-center min-h-[60vh]'>
          <div className='text-center max-w-md mx-auto'>
            <div className='w-24 h-24 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center'>
              <svg
                fill='none'
                stroke='currentColor'
                viewBox='0 0 48 48'
                className='w-12 h-12 text-gray-400'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M18 12h12m-6 8v8m-6-8v8'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M8 8h32v32H8z'
                />
              </svg>
            </div>
            <h1 className='text-2xl font-bold text-gray-900 mb-4'>
              Dostęp do panelu wymaga logowania
            </h1>
            <p className='text-gray-600 mb-8'>
              Zaloguj się, aby uzyskać dostęp do swojego panelu sprzątania i
              zarządzać usługami.
            </p>
            <SignInButton mode='modal' forceRedirectUrl='/dashboard'>
              <button className='bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium'>
                Zaloguj się
              </button>
            </SignInButton>
          </div>
        </div>
      </PageLayout>
    )
  }

  // Mock data for development
  const userSessions = mockCleaningSessions.map((session) => ({
    ...session,
    userId: user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }))

  const completedSessions = userSessions.filter(
    (s) => s.status === 'completed'
  ).length
  const totalDuration = userSessions
    .filter((s) => s.duration)
    .reduce((sum, s) => sum + (s.duration || 0), 0)
  const averageRating = userSessions
    .filter((s) => s.rating)
    .reduce((sum, s, _, arr) => sum + (s.rating || 0) / arr.length, 0)
  const upcomingSessions = userSessions.filter(
    (s) => s.status === 'scheduled'
  ).length

  return (
    <PageLayout>
      {/* Header */}
      <div className='text-center mb-6 sm:mb-12'>
        <h1 className='text-4xl md:text-5xl font-light text-gray-900 mb-4 break-words'>
          Witaj,{' '}
          <span className='inline-block'>
            {user?.firstName ||
              user?.emailAddresses[0]?.emailAddress?.split('@')[0] ||
              'Użytkowniku'}
          </span>
          ! 👋
        </h1>
        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
          {loadingBookings ? (
            'Sprawdzam twoje rezerwacje...'
          ) : nextBooking ? (
            'Masz zaplanowane sprzątanie'
          ) : (
            'Nie masz zaplanowanego sprzątania'
          )}
        </p>
      </div>

      {/* Next Booking Card */}
      {!loadingBookings && nextBooking && (
        <div className='mb-8 max-w-md mx-auto'>
          <div className='bg-white rounded-lg border border-gray-200 p-4 shadow-sm relative'>
            {/* Przycisk Odwołaj - prawy górny róg */}
            <button 
              onClick={handleCancelBooking}
              className='absolute top-4 right-4 text-red-500 hover:text-red-600 text-sm font-bold'
            >
              Odwołaj
            </button>
            
            {/* Główna zawartość */}
            <div className='pr-16'>
              <h4 className='text-gray-900 text-xl font-bold mb-3'>
                {nextBooking.addressName || nextBooking.addressId || 'Do ustalenia'}
              </h4>
              <div className='space-y-1'>
                <p className='text-gray-900 text-base'>
                  {nextBooking.scheduledTime
                    ? new Date(nextBooking.scheduledTime).toLocaleDateString('pl-PL', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : 'Data do ustalenia'}
                </p>
                <p className='text-gray-900 text-base'>
                  Godzina: {nextBooking.scheduledTime
                    ? new Date(nextBooking.scheduledTime).toLocaleTimeString('pl-PL', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Do ustalenia'}
                </p>
              </div>
            </div>
            
            {/* Przycisk Zmień - prawy dolny róg */}
            <button 
              onClick={handleEditBooking}
              className='absolute bottom-4 right-4 text-emerald-500 hover:text-emerald-600 text-sm font-bold'
            >
              Zmień
            </button>
          </div>
        </div>
      )}

      {/* Elegant Accordion Dashboard */}
      <div className='space-y-4'>
        {/* Main Actions */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <a
            href='/calendar'
            className='w-full bg-white text-gray-700 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-left block overflow-hidden'
          >
            <div className='flex items-center space-x-4 px-6 py-4'>
              <svg
                className='w-6 h-6 text-green-500'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                />
              </svg>
              <div>
                <span className='font-semibold text-lg'>Zarezerwuj termin</span>
              </div>
            </div>
          </a>

          <a
            href='/account'
            className='w-full border border-gray-200 bg-white text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-left overflow-hidden block'
          >
            <div className='flex items-center space-x-4 px-6 py-4'>
              <svg
                className='w-6 h-6 text-blue-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                />
              </svg>
              <div>
                <span className='font-semibold text-lg'>Twoje konto</span>
              </div>
            </div>
          </a>
        </div>

        {/* Historia sprzątania - at the top */}
        <AccordionSection
          id='recent'
          title='Historia sprzątania'
          icon={<ClockIcon className='w-6 h-6 text-orange-600' />}
        >
          <div className='space-y-3'>
            {loadingHistory ? (
              <div className='flex justify-center py-8'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500'></div>
              </div>
            ) : historyBookings.length > 0 ? (
              historyBookings.map((booking) => (
                <div key={booking.id} className='bg-white rounded-lg border border-gray-200 p-4'>
                  <div className='flex items-center space-x-3'>
                    <div className='flex items-center justify-center flex-shrink-0 w-8 h-8'>
                      <svg
                        className={`w-5 h-5 ${
                          booking.status === 'completed' 
                            ? 'text-green-600' 
                            : 'text-orange-600'
                        }`}
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        {booking.status === 'completed' ? (
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={3}
                            d='M5 13l4 4L19 7'
                          />
                        ) : (
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={3}
                            d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                          />
                        )}
                      </svg>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='font-medium text-gray-900 text-sm mb-2'>
                        {booking.addressName || booking.addressId || 'Lokalizacja nieznana'}
                      </p>
                      <div className='flex items-center justify-between'>
                        <p className='text-xs text-gray-500'>
                          {booking.scheduledTime 
                            ? new Date(booking.scheduledTime).toLocaleDateString('pl-PL', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })
                            : 'Data nieznana'}
                        </p>
                        {booking.status === 'completed' ? (
                          <div className='bg-green-50 border border-green-200 px-2 py-1 rounded-md'>
                            <p className='font-medium text-green-800 text-sm'>200 zł</p>
                          </div>
                        ) : (
                          <div className='w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center'>
                            <span className='text-gray-500 font-medium text-lg'>?</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='text-center py-8'>
                <div className='w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
                  <ClockIcon className='w-8 h-8 text-gray-400' />
                </div>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  Brak historii sprzątania
                </h3>
                <p className='text-gray-600'>
                  Twoje ukończone sprzątania pojawią się tutaj.
                </p>
              </div>
            )}
          </div>
        </AccordionSection>

        {/* Main Recordings Section */}
        <AccordionSection
          id='recordings'
          title='Twoje nagrania'
          icon={<VideoIcon className='w-6 h-6 text-purple-600' />}
          defaultOpen={true}
        >
          <div className='rounded-lg'>
            <RecordingsGallery sessions={userSessions} />
          </div>
        </AccordionSection>

        {/* Stats Overview */}
        <AccordionSection
          id='stats'
          title='Przegląd statystyk'
          icon={<ChartBarIcon className='w-6 h-6 text-green-600' />}
        >
          <div className='flex flex-wrap gap-4'>
            <div className='w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)] bg-white rounded-lg border border-gray-200 p-4'>
              <div className='flex items-center space-x-3'>
                <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                  <svg
                    className='w-5 h-5 text-green-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <div>
                  <p className='text-xl font-bold text-gray-900'>
                    {completedSessions}
                  </p>
                  <p className='text-sm text-gray-600'>Zakończone</p>
                </div>
              </div>
            </div>

            <div className='w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)] bg-white rounded-lg border border-gray-200 p-4'>
              <div className='flex items-center space-x-3'>
                <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                  <svg
                    className='w-5 h-5 text-blue-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <div>
                  <p className='text-xl font-bold text-gray-900'>
                    {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                  </p>
                  <p className='text-sm text-gray-600'>Łączny czas</p>
                </div>
              </div>
            </div>

            <div className='w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)] bg-white rounded-lg border border-gray-200 p-4'>
              <div className='flex items-center space-x-3'>
                <div className='w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                  <svg
                    className='w-5 h-5 text-yellow-600'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
                  </svg>
                </div>
                <div>
                  <p className='text-xl font-bold text-gray-900'>
                    {averageRating > 0 ? averageRating.toFixed(1) : '-'}
                  </p>
                  <p className='text-sm text-gray-600'>Średnia ocena</p>
                </div>
              </div>
            </div>

            <div className='w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)] bg-white rounded-lg border border-gray-200 p-4'>
              <div className='flex items-center space-x-3'>
                <div className='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                  <svg
                    className='w-5 h-5 text-purple-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                    />
                  </svg>
                </div>
                <div>
                  <p className='text-xl font-bold text-gray-900'>
                    {upcomingSessions}
                  </p>
                  <p className='text-sm text-gray-600'>Nadchodzące</p>
                </div>
              </div>
            </div>
          </div>
        </AccordionSection>
      </div>

      {/* Cancel Booking Modal */}
      {showCancelModal && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center p-4'
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
          onClick={handleCancelModalClose}
        >
          <div
            className='bg-white rounded-lg shadow-lg max-w-md w-full p-6'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='mb-4'>
              <p className='text-gray-600 text-center font-bold'>
                Czy na pewno chcesz odwołać to sprzątanie?
              </p>
            </div>
            <div className='flex space-x-3'>
              <button
                onClick={handleCancelModalClose}
                className='flex-1 bg-white text-black py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-bold'
              >
                Anuluj
              </button>
              <button
                onClick={handleCancelConfirm}
                className='flex-1 bg-white text-red-500 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-bold'
              >
                Odwołaj
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  )
}
