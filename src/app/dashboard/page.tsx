'use client'

import PageLayout from '@/components/page-layout'
import RecordingsGallery from '@/components/recordings-gallery'
import { useUser, SignInButton } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { mockCleaningSessions } from '@/db/mock-data'

export default function Dashboard() {
  const { isSignedIn, user, isLoaded } = useUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show loading state while checking authentication
  if (!mounted || !isLoaded) {
    return (
      <PageLayout>
        <div className='flex items-center justify-center min-h-[50vh]'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4'></div>
            <p className='text-gray-600'>Ładowanie...</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  // Show sign-in prompt if not authenticated
  if (!isSignedIn) {
    return (
      <PageLayout>
        <div className='flex items-center justify-center min-h-[50vh]'>
          <div className='text-center max-w-md mx-auto'>
            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
              <svg
                className='w-8 h-8 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
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

  // Mock data for development - in production this would come from the database
  const userSessions = mockCleaningSessions.map((session) => ({
    ...session,
    userId: user.id, // Replace with actual user ID
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
      <div className='text-center'>
        <h1 className='text-4xl md:text-6xl font-light text-gray-900 mb-4'>
          Witaj,{' '}
          {user?.firstName ||
            user?.emailAddresses[0]?.emailAddress?.split('@')[0] ||
            'Użytkowniku'}
          ! 👋
        </h1>
        <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
          Twoje nagrania i statystyki sprzątania w jednym miejscu.
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 sm:mt-12'>
        <div className='bg-white rounded-xl border border-gray-100 p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Zakończone sprzątania
              </p>
              <p className='text-3xl font-bold text-gray-900 mt-2'>
                {completedSessions}
              </p>
            </div>
            <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
              <svg
                className='w-6 h-6 text-green-600'
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
          </div>
        </div>

        <div className='bg-white rounded-xl border border-gray-100 p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Łączny czas</p>
              <p className='text-3xl font-bold text-gray-900 mt-2'>
                {Math.floor(totalDuration / 60)}h {totalDuration % 60}min
              </p>
            </div>
            <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
              <svg
                className='w-6 h-6 text-blue-600'
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
          </div>
        </div>

        <div className='bg-white rounded-xl border border-gray-100 p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Średnia ocena</p>
              <p className='text-3xl font-bold text-gray-900 mt-2'>
                {averageRating > 0 ? averageRating.toFixed(1) : '-'}
              </p>
            </div>
            <div className='w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center'>
              <svg
                className='w-6 h-6 text-yellow-600'
                fill='currentColor'
                viewBox='0 0 24 24'
              >
                <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
              </svg>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-xl border border-gray-100 p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Nadchodzące</p>
              <p className='text-3xl font-bold text-gray-900 mt-2'>
                {upcomingSessions}
              </p>
            </div>
            <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
              <svg
                className='w-6 h-6 text-purple-600'
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
          </div>
        </div>
      </div>

      {/* Recordings Gallery */}
      <div className='mt-8 sm:mt-12'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-2xl font-bold text-gray-900'>Twoje nagrania</h2>
          <div className='text-sm text-gray-500'>
            {userSessions.length}{' '}
            {userSessions.length === 1 ? 'nagranie' : 'nagrań'}
          </div>
        </div>

        <RecordingsGallery sessions={userSessions} />
      </div>

      {/* Metrics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 sm:mt-12'>
        <div className='bg-white rounded-xl border border-gray-100 p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Łączne sprzątania
              </p>
              <p className='text-3xl font-bold text-gray-900 mt-2'>47</p>
            </div>
            <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
              <svg
                className='w-6 h-6 text-blue-600'
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
          </div>
          <p className='text-sm text-green-600 mt-2'>+12% w tym miesiącu</p>
        </div>

        <div className='bg-white rounded-xl border border-gray-100 p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Oszczędzone godziny
              </p>
              <p className='text-3xl font-bold text-gray-900 mt-2'>142</p>
            </div>
            <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
              <svg
                className='w-6 h-6 text-green-600'
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
          </div>
          <p className='text-sm text-green-600 mt-2'>Czas dla siebie</p>
        </div>

        <div className='bg-white rounded-xl border border-gray-100 p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Następne sprzątanie
              </p>
              <p className='text-2xl font-bold text-gray-900 mt-2'>Za 3 dni</p>
            </div>
            <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
              <svg
                className='w-6 h-6 text-purple-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z'
                />
              </svg>
            </div>
          </div>
          <p className='text-sm text-gray-500 mt-2'>28 stycznia, 10:00</p>
        </div>

        <div className='bg-white rounded-xl border border-gray-100 p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Ocena jakości</p>
              <p className='text-3xl font-bold text-gray-900 mt-2'>4.9</p>
            </div>
            <div className='w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center'>
              <svg
                className='w-6 h-6 text-yellow-600'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
              </svg>
            </div>
          </div>
          <p className='text-sm text-gray-500 mt-2'>Średnia z 47 opinii</p>
        </div>
      </div>

      <div className='grid lg:grid-cols-3 gap-8 mt-8 sm:mt-12'>
        {/* Recent Services */}
        <div className='lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6'>
          <h2 className='text-xl font-semibold text-gray-900 mb-6'>
            Ostatnie sprzątania
          </h2>
          <div className='space-y-4'>
            <div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
              <div className='flex items-center space-x-4'>
                <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center'>
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
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
                <div>
                  <p className='font-medium text-gray-900'>
                    Sprzątanie mieszkania
                  </p>
                  <p className='text-sm text-gray-500'>
                    20 stycznia 2025 • Anna K.
                  </p>
                </div>
              </div>
              <div className='text-right'>
                <p className='font-semibold text-gray-900'>200 zł</p>
                <p className='text-sm text-green-600'>Zakończone</p>
              </div>
            </div>

            <div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
              <div className='flex items-center space-x-4'>
                <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center'>
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
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
                <div>
                  <p className='font-medium text-gray-900'>Pranie okien</p>
                  <p className='text-sm text-gray-500'>
                    15 stycznia 2025 • Michał S.
                  </p>
                </div>
              </div>
              <div className='text-right'>
                <p className='font-semibold text-gray-900'>120 zł</p>
                <p className='text-sm text-green-600'>Zakończone</p>
              </div>
            </div>

            <div className='flex items-center justify-between p-4 bg-blue-50 rounded-lg'>
              <div className='flex items-center space-x-4'>
                <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
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
                  <p className='font-medium text-gray-900'>Sprzątanie biura</p>
                  <p className='text-sm text-gray-500'>
                    28 stycznia 2025 • 10:00
                  </p>
                </div>
              </div>
              <div className='text-right'>
                <p className='font-semibold text-gray-900'>350 zł</p>
                <p className='text-sm text-blue-600'>Zaplanowane</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className='bg-white rounded-xl border border-gray-100 p-6'>
          <h2 className='text-xl font-semibold text-gray-900 mb-6'>
            Szybkie akcje
          </h2>
          <div className='space-y-3'>
            <button className='w-full bg-gray-900 text-white p-3 rounded-lg hover:bg-gray-800 transition-colors text-left'>
              <div className='flex items-center space-x-3'>
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
                    d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                  />
                </svg>
                <span>Zamów sprzątanie</span>
              </div>
            </button>

            <button className='w-full border border-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left'>
              <div className='flex items-center space-x-3'>
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
                    d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z'
                  />
                </svg>
                <span>Zmień termin</span>
              </div>
            </button>

            <button className='w-full border border-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left'>
              <div className='flex items-center space-x-3'>
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
                    d='M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z'
                  />
                </svg>
                <span>Skontaktuj się</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Order History & Cleaning Streams */}
      <div className='grid lg:grid-cols-2 gap-8 mt-8 sm:mt-12'>
        {/* Order History */}
        <div className='bg-white rounded-xl border border-gray-100 p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-semibold text-gray-900'>
              Historia zamówień
            </h2>
            <button className='text-sm text-gray-600 hover:text-gray-900'>
              Zobacz wszystkie
            </button>
          </div>
          <div className='space-y-3'>
            <div className='flex items-center justify-between py-3 border-b border-gray-100'>
              <div>
                <p className='font-medium text-gray-900'>#SP-2025-047</p>
                <p className='text-sm text-gray-500'>
                  Sprzątanie mieszkania • 20.01.2025
                </p>
              </div>
              <span className='px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full'>
                Zakończone
              </span>
            </div>
            <div className='flex items-center justify-between py-3 border-b border-gray-100'>
              <div>
                <p className='font-medium text-gray-900'>#SP-2025-046</p>
                <p className='text-sm text-gray-500'>
                  Pranie okien • 15.01.2025
                </p>
              </div>
              <span className='px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full'>
                Zakończone
              </span>
            </div>
            <div className='flex items-center justify-between py-3 border-b border-gray-100'>
              <div>
                <p className='font-medium text-gray-900'>#SP-2025-045</p>
                <p className='text-sm text-gray-500'>
                  Sprzątanie biura • 10.01.2025
                </p>
              </div>
              <span className='px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full'>
                Zakończone
              </span>
            </div>
            <div className='flex items-center justify-between py-3'>
              <div>
                <p className='font-medium text-gray-900'>#SP-2025-044</p>
                <p className='text-sm text-gray-500'>
                  Sprzątanie mieszkania • 05.01.2025
                </p>
              </div>
              <span className='px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full'>
                Zakończone
              </span>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
