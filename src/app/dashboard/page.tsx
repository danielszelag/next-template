'use client'

import { useUser } from '@clerk/nextjs'
import { SignInButton } from '@clerk/nextjs'
import { useState } from 'react'
import PageLayout from '@/components/page-layout'
import RecordingsGallery from '@/components/recordings-gallery'
import { mockCleaningSessions } from '@/db/mock-data'

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    recordings: true, // Keep recordings open by default
    stats: false,
    recent: false,
    actions: false,
    history: false,
  })

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
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
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
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
      <div className='text-center mb-8'>
        <h1 className='text-4xl md:text-5xl font-light text-gray-900 mb-4'>
          Witaj,{' '}
          {user?.firstName ||
            user?.emailAddresses[0]?.emailAddress?.split('@')[0] ||
            'Użytkowniku'}
          ! 👋
        </h1>
        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
          Zarządzaj swoimi sprzątaniami i monitoruj postępy w przejrzystym,
          zorganizowanym interfejsie.
        </p>
      </div>

      {/* Elegant Accordion Dashboard */}
      <div className='space-y-4'>
        {/* Quick Actions */}
        <AccordionSection
          id='actions'
          title='Szybkie akcje'
          icon={
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
                d='M13 10V3L4 14h7v7l9-11h-7z'
              />
            </svg>
          }
        >
          <div className='space-y-3'>
            <button className='w-full bg-gray-900 text-white p-4 rounded-lg hover:bg-gray-800 transition-colors text-left'>
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
                <span className='font-medium'>Zamów sprzątanie</span>
              </div>
            </button>

            <button className='w-full border border-gray-200 bg-white text-gray-700 p-4 rounded-lg hover:bg-gray-50 transition-colors text-left'>
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
                    d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                  />
                </svg>
                <span className='font-medium'>Zmień termin</span>
              </div>
            </button>

            <button className='w-full border border-gray-200 bg-white text-gray-700 p-4 rounded-lg hover:bg-gray-50 transition-colors text-left'>
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
                <span className='font-medium'>Skontaktuj się</span>
              </div>
            </button>

            <button className='w-full border border-gray-200 bg-white text-gray-700 p-4 rounded-lg hover:bg-gray-50 transition-colors text-left'>
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
                    d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                  />
                </svg>
                <span className='font-medium'>Zobacz raporty</span>
              </div>
            </button>
          </div>
        </AccordionSection>

        {/* Main Recordings Section */}
        <AccordionSection
          id='recordings'
          title='Twoje nagrania'
          icon={
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
                d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
              />
            </svg>
          }
          defaultOpen={true}
        >
          <div className='bg-white rounded-lg p-4 -mx-2'>
            <RecordingsGallery sessions={userSessions} />
          </div>
        </AccordionSection>

        {/* Stats Overview */}
        <AccordionSection
          id='stats'
          title='Przegląd statystyk'
          icon={
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
                d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
              />
            </svg>
          }
        >
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div className='bg-white rounded-lg border border-gray-200 p-4'>
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

            <div className='bg-white rounded-lg border border-gray-200 p-4'>
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

            <div className='bg-white rounded-lg border border-gray-200 p-4'>
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

            <div className='bg-white rounded-lg border border-gray-200 p-4'>
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

        {/* Recent Activities */}
        <AccordionSection
          id='recent'
          title='Ostatnie sprzątania'
          icon={
            <svg
              className='w-6 h-6 text-orange-600'
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
          }
        >
          <div className='space-y-3'>
            <div className='bg-white rounded-lg border border-gray-200 p-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <div className='w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center'>
                    <svg
                      className='w-4 h-4 text-gray-600'
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
                    <p className='font-medium text-gray-900 text-sm'>
                      Sprzątanie mieszkania
                    </p>
                    <p className='text-xs text-gray-500'>20 stycznia 2025</p>
                  </div>
                </div>
                <p className='font-medium text-gray-900 text-sm'>200 zł</p>
              </div>
            </div>

            <div className='bg-white rounded-lg border border-gray-200 p-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <div className='w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center'>
                    <svg
                      className='w-4 h-4 text-gray-600'
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
                    <p className='font-medium text-gray-900 text-sm'>
                      Pranie okien
                    </p>
                    <p className='text-xs text-gray-500'>15 stycznia 2025</p>
                  </div>
                </div>
                <p className='font-medium text-gray-900 text-sm'>120 zł</p>
              </div>
            </div>

            <div className='bg-white rounded-lg border border-gray-200 p-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <div className='w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center'>
                    <svg
                      className='w-4 h-4 text-gray-600'
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
                    <p className='font-medium text-gray-900 text-sm'>
                      Sprzątanie biura
                    </p>
                    <p className='text-xs text-gray-500'>
                      28 stycznia 2025 • 10:00
                    </p>
                  </div>
                </div>
                <p className='font-medium text-gray-900 text-sm'>350 zł</p>
              </div>
            </div>
          </div>
        </AccordionSection>

        {/* Order History */}
        <AccordionSection
          id='history'
          title='Historia zamówień'
          badge='47 zamówień'
          icon={
            <svg
              className='w-6 h-6 text-indigo-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
              />
            </svg>
          }
        >
          <div className='space-y-2'>
            <div className='bg-white rounded-lg border border-gray-200 p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium text-gray-900 text-sm'>
                    #SP-2025-047
                  </p>
                  <p className='text-xs text-gray-500'>
                    Sprzątanie mieszkania • 20.01.2025
                  </p>
                </div>
                <span className='px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded'>
                  Zakończone
                </span>
              </div>
            </div>

            <div className='bg-white rounded-lg border border-gray-200 p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium text-gray-900 text-sm'>
                    #SP-2025-046
                  </p>
                  <p className='text-xs text-gray-500'>
                    Pranie okien • 15.01.2025
                  </p>
                </div>
                <span className='px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded'>
                  Zakończone
                </span>
              </div>
            </div>

            <div className='bg-white rounded-lg border border-gray-200 p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium text-gray-900 text-sm'>
                    #SP-2025-045
                  </p>
                  <p className='text-xs text-gray-500'>
                    Sprzątanie biura • 10.01.2025
                  </p>
                </div>
                <span className='px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded'>
                  Zakończone
                </span>
              </div>
            </div>

            <div className='pt-3 text-center'>
              <button className='text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors'>
                Zobacz wszystkie zamówienia →
              </button>
            </div>
          </div>
        </AccordionSection>
      </div>
    </PageLayout>
  )
}
