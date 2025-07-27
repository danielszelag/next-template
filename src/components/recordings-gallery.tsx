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

  // Sort sessions: live first, then by most recent time
  const sortedSessions = [...sessions].sort((a, b) => {
    // Live sessions always come first
    if (a.status === 'live' && b.status !== 'live') return -1
    if (b.status === 'live' && a.status !== 'live') return 1

    // Then sort by most recent time (newest first)
    return (
      new Date(b.startTime || b.scheduledTime || 0).getTime() -
      new Date(a.startTime || a.scheduledTime || 0).getTime()
    )
  })

  const handlePlaySession = (session: CleaningSession) => {
    setSelectedSession(session)
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
            Nie masz jeszcze żadnych nagrań sprzątania.
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
