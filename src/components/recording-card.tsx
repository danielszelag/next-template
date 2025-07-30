'use client'

import { CleaningSession } from '@/db/schema'

interface RecordingCardProps {
  session: CleaningSession
  onPlay: (session: CleaningSession) => void
}

export default function RecordingCard({ session, onPlay }: RecordingCardProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return 'Nie określono'
    return new Intl.DateTimeFormat('pl-PL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const formatLocation = (location: string) => {
    // Extract just the street name, remove numbers and districts
    const parts = location.split(',').map((part) => part.trim())
    // Take the street name (first part) and remove numbers
    const streetName = parts[0].replace(/\d+/g, '').trim()
    return streetName
  }

  if (session.streamId === null && session.liveInputId === null) return null

  return (
    <div
      className={`bg-white hover:bg-gray-50 rounded-lg p-4 hover:shadow-lg active:bg-gray-100 transition-all duration-200 cursor-pointer relative border border-gray-200 hover:border-gray-300 h-48 min-h-48 hover:backdrop-blur-sm`}
      onClick={() => onPlay(session)}
    >
      {/* Date in top left corner */}
      <p className='absolute top-3 left-3 text-xs text-gray-500 hover:blur-[0.5px] transition-all duration-200'>
        {formatDate(session.startTime || session.scheduledTime)}
      </p>

      {/* Live indicator in top right corner */}
      {session.status === 'live' && (
        <div className='absolute top-3 right-3 flex items-center space-x-1 hover:blur-[0.5px] transition-all duration-200'>
          <div className='w-2 h-2 bg-red-500 rounded-full animate-pulse'></div>
          <span className='text-xs font-medium text-red-600'>LIVE</span>
        </div>
      )}

      <div className='flex flex-col items-center justify-center h-full'>
        {/* Centered Play button - stays sharp */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPlay(session)
          }}
          className='w-16 h-16 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm group z-10 relative'
        >
          <svg
            className='w-6 h-6 text-gray-600 ml-0.5 group-hover:text-gray-800 transition-colors duration-200'
            fill='currentColor'
            viewBox='0 0 24 24'
          >
            <path d='M8 5v14l11-7z' />
          </svg>
        </button>
      </div>

      {/* Street name in bottom left corner */}
      <p className='absolute bottom-3 left-3 text-sm text-gray-700 font-medium hover:blur-[0.5px] transition-all duration-200'>
        {formatLocation(session.location)}
      </p>
    </div>
  )
}
