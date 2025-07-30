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

  const filteredSessions = [...sessions].filter(
    (s) => s.liveInputId || s.streamId
  )

  // Sort sessions: live first, then by most recent time
  const sortedSessions = [...filteredSessions].sort((a, b) => {
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

  return (
    <div className='space-y-6'>
      {sortedSessions.length > 0 ? (
        <div className='flex flex-wrap gap-6'>
          {sortedSessions.map((session) => (
            <div
              key={session.id}
              className='w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]'
            >
              <RecordingCard session={session} onPlay={handlePlaySession} />
            </div>
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
