'use client'

import { useState } from 'react'
import { CleaningSession } from '@/db/schema'
import RecordingCard from './recording-card'
import VideoPlayer from './video-player'

interface RecordingsGalleryProps {
  sessions: CleaningSession[]
}

export default function RecordingsGallery({
  sessions,
}: RecordingsGalleryProps) {
  const [selectedSession, setSelectedSession] =
    useState<CleaningSession | null>(null)
  const [filter, setFilter] = useState<
    'all' | 'live' | 'completed' | 'scheduled'
  >('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating'>('newest')

  // Filter sessions
  const filteredSessions = sessions.filter((session) => {
    if (filter === 'all') return true
    return session.status === filter
  })

  // Sort sessions
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return (
          new Date(b.startTime || b.scheduledTime || 0).getTime() -
          new Date(a.startTime || a.scheduledTime || 0).getTime()
        )
      case 'oldest':
        return (
          new Date(a.startTime || a.scheduledTime || 0).getTime() -
          new Date(b.startTime || b.scheduledTime || 0).getTime()
        )
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      default:
        return 0
    }
  })

  const handlePlaySession = (session: CleaningSession) => {
    setSelectedSession(session)
  }

  const getFilterCount = (filterType: typeof filter) => {
    if (filterType === 'all') return sessions.length
    return sessions.filter((s) => s.status === filterType).length
  }

  const liveSession = sessions.find((s) => s.status === 'live')

  return (
    <div className='space-y-6'>
      {/* Live session banner */}
      {liveSession && (
        <div className='bg-gradient-to-r from-red-500 to-pink-600 rounded-xl p-6 text-white'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-white rounded-full animate-pulse'></div>
                <span className='font-semibold text-lg'>
                  Trwa sprzątanie na żywo!
                </span>
              </div>
              <div className='text-red-100'>
                {liveSession.cleanerName} • {liveSession.location}
              </div>
            </div>
            <button
              onClick={() => handlePlaySession(liveSession)}
              className='bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg font-medium transition-colors'
            >
              Oglądaj na żywo
            </button>
          </div>
        </div>
      )}

      {/* Filters and sorting */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div className='flex items-center space-x-2'>
          <span className='text-sm font-medium text-gray-700'>Filtruj:</span>
          <div className='flex space-x-1'>
            {(['all', 'live', 'completed', 'scheduled'] as const).map(
              (filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterType
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filterType === 'all'
                    ? 'Wszystkie'
                    : filterType === 'live'
                    ? 'Na żywo'
                    : filterType === 'completed'
                    ? 'Zakończone'
                    : 'Zaplanowane'}
                  <span className='ml-1 text-xs opacity-75'>
                    ({getFilterCount(filterType)})
                  </span>
                </button>
              )
            )}
          </div>
        </div>

        <div className='flex items-center space-x-2'>
          <span className='text-sm font-medium text-gray-700'>Sortuj:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className='px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent'
          >
            <option value='newest'>Najnowsze</option>
            <option value='oldest'>Najstarsze</option>
            <option value='rating'>Najlepiej oceniane</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className='text-sm text-gray-600'>
        Znaleziono {sortedSessions.length} nagrań
      </div>

      {/* Sessions grid */}
      {sortedSessions.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {sortedSessions.map((session) => (
            <RecordingCard
              key={session.id}
              session={session}
              onPlay={handlePlaySession}
            />
          ))}
        </div>
      ) : (
        <div className='text-center py-12'>
          <svg
            className='w-16 h-16 text-gray-400 mx-auto mb-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1}
              d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
            />
          </svg>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            Brak nagrań
          </h3>
          <p className='text-gray-600'>
            {filter === 'all'
              ? 'Nie masz jeszcze żadnych nagrań sprzątania.'
              : `Brak nagrań w kategorii "${
                  filter === 'live'
                    ? 'Na żywo'
                    : filter === 'completed'
                    ? 'Zakończone'
                    : 'Zaplanowane'
                }".`}
          </p>
        </div>
      )}

      {/* Video player modal */}
      {selectedSession && (
        <VideoPlayer
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  )
}
