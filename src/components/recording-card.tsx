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
      className='group relative overflow-hidden rounded-lg p-4 cursor-pointer transition-all duration-300 transform hover:scale-[1.01] h-48 min-h-48 bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 shadow-lg hover:shadow-gray-900/20 hover:shadow-xl'
      onClick={() => onPlay(session)}
    >
      {/* Date in top left corner */}
      <p className='absolute top-3 left-3 text-xs font-medium text-white/80 group-hover:text-white transition-colors duration-200'>
        {formatDate(session.startTime || session.scheduledTime)}
      </p>

      {/* Live indicator in top right corner - ONLY red part */}
      {session.status === 'live' && (
        <div className='absolute top-3 right-3 flex items-center space-x-2'>
          <div className='w-2 h-2 bg-red-500 rounded-full animate-pulse'></div>
          <span className='text-xs font-bold text-red-500'>LIVE</span>
        </div>
      )}

      <div className='flex flex-col items-center justify-center h-full'>
        {/* Centered play button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPlay(session)
          }}
          className='w-16 h-16 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 transform group-hover:scale-110 group-active:scale-95 shadow-lg'
        >
          <svg
            className='w-6 h-6 text-white ml-0.5 transition-all duration-200'
            fill='currentColor'
            viewBox='0 0 24 24'
          >
            <path d='M8 5v14l11-7z' />
          </svg>
        </button>
      </div>

      {/* Street name in bottom with subtle background */}
      <div className='absolute bottom-3 left-3 right-3'>
        <div className='bg-black/20 backdrop-blur-sm rounded px-2 py-1'>
          <p className='text-sm font-medium text-white truncate'>
            {formatLocation(session.location)}
          </p>
        </div>
      </div>
    </div>
  )
}
