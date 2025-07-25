'use client'

import Image from 'next/image'
import { CleaningSession } from '@/db/schema'
import { statusLabels, serviceTypeLabels } from '@/db/mock-data'

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

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return 'Nie określono'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}min`
    }
    return `${mins}min`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-red-100 text-red-700'
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'scheduled':
        return 'bg-blue-100 text-blue-700'
      case 'cancelled':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className='bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow'>
      {/* Thumbnail */}
      <div className='relative aspect-video bg-gray-100'>
        {session.thumbnailUrl ? (
          <Image
            src={session.thumbnailUrl}
            alt={`Sprzątanie - ${session.location}`}
            fill
            className='object-cover'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200'>
            <div className='text-center'>
              <svg
                className='w-12 h-12 text-gray-400 mx-auto mb-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
                />
              </svg>
              <p className='text-sm text-gray-500'>
                {session.status === 'live' ? 'Na żywo' : 'Brak nagrania'}
              </p>
            </div>
          </div>
        )}

        {/* Status overlay */}
        <div className='absolute top-3 right-3'>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              session.status
            )}`}
          >
            {session.status === 'live' && '🔴 '}
            {statusLabels[session.status as keyof typeof statusLabels] ||
              session.status}
          </span>
        </div>

        {/* Duration overlay */}
        {session.duration && (
          <div className='absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs'>
            {formatDuration(session.duration)}
          </div>
        )}

        {/* Play button overlay */}
        {(session.recordingUrl || session.status === 'live') && (
          <button
            onClick={() => onPlay(session)}
            className='absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-all group'
          >
            <div className='w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all'>
              <svg
                className='w-8 h-8 text-gray-900 ml-1'
                fill='currentColor'
                viewBox='0 0 24 24'
              >
                <path d='M8 5v14l11-7z' />
              </svg>
            </div>
          </button>
        )}
      </div>

      {/* Content */}
      <div className='p-4'>
        {/* Cleaner info */}
        <div className='flex items-center space-x-3 mb-3'>
          <div className='relative w-10 h-10 rounded-full overflow-hidden'>
            <Image
              src={session.cleanerAvatar || '/default-avatar.png'}
              alt={session.cleanerName}
              fill
              className='object-cover'
            />
          </div>
          <div>
            <h3 className='font-medium text-gray-900'>{session.cleanerName}</h3>
            <p className='text-sm text-gray-500'>
              {serviceTypeLabels[
                session.serviceType as keyof typeof serviceTypeLabels
              ] || session.serviceType}
            </p>
          </div>
        </div>

        {/* Location */}
        <p className='text-sm text-gray-600 mb-2 flex items-center'>
          <svg
            className='w-4 h-4 mr-1 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
            />
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
            />
          </svg>
          {session.location}
        </p>

        {/* Date */}
        <p className='text-sm text-gray-500 mb-3'>
          {formatDate(session.startTime || session.scheduledTime)}
        </p>

        {/* Rating */}
        {session.rating && (
          <div className='flex items-center space-x-1'>
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < session.rating! ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill='currentColor'
                viewBox='0 0 24 24'
              >
                <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
              </svg>
            ))}
            <span className='text-sm text-gray-500 ml-1'>
              ({session.rating}/5)
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
