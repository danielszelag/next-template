'use client'

import { useState, useRef, useEffect } from 'react'
import { CleaningSession } from '@/db/schema'

interface VideoPlayerProps {
  session: CleaningSession
  onClose: () => void
}

export default function VideoPlayer({ session, onClose }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const newTime = (parseFloat(e.target.value) / 100) * duration
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = parseFloat(e.target.value) / 100
    video.volume = newVolume
    setVolume(newVolume)
  }

  const toggleFullscreen = () => {
    const container = containerRef.current
    if (!container) return

    if (!isFullscreen) {
      container.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const isLiveStream = session.status === 'live'

  return (
    <div className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-4'>
      <div
        ref={containerRef}
        className='w-full max-w-3xl sm:max-w-5xl md:max-w-6xl bg-black rounded-lg overflow-hidden'
        style={{ maxHeight: '90vh' }}
      >
        {/* Header */}
  <div className='bg-gray-900 px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center'>
                <span className='text-white font-medium text-sm'>
                  {session.cleanerName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
              </div>
              <div>
                <h2 className='text-white font-medium'>
                  {session.cleanerName}
                </h2>
                <p className='text-gray-400 text-sm'>
                  • Lokalizacja nieznana
                </p>
              </div>
            </div>
            {isLiveStream && (
              <div className='flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full'>
                <div className='w-2 h-2 bg-white rounded-full animate-pulse'></div>
                <span className='text-white text-sm font-medium'>NA ŻYWO</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className='text-white hover:text-gray-300 transition-colors p-2 rounded-md touch-manipulation'
            aria-label='Zamknij'
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

  {/* Video */}
  <div className='relative bg-black' style={{ aspectRatio: '16/9', maxHeight: '60vh' }}>
          {session.recordingUrl || isLiveStream ? (
            <video
              ref={videoRef}
              src={session.recordingUrl || undefined}
              className='w-full h-full object-contain'
              poster={session.thumbnailUrl || undefined}
              autoPlay={isLiveStream}
              muted={isLiveStream} // Auto-mute live streams to allow autoplay
              playsInline
              controls={false}
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center'>
              <div className='text-center text-white'>
                <svg
                  className='w-20 h-20 mx-auto mb-4 text-gray-600'
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
                <p className='text-lg'>Nagranie niedostępne</p>
                <p className='text-gray-400'>
                  To sprzątanie nie zostało jeszcze zarejestrowane
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        {(session.recordingUrl || isLiveStream) && (
          <div className='bg-gray-900 px-4 py-3 sm:px-6 sm:py-4'>
              <div className='flex items-center gap-3 w-full'>
                <div className='flex items-center gap-3 flex-1 min-w-0'>
                  {/* Current time */}
                  {!isLiveStream && (
                    <div className='text-white text-sm font-mono w-12 text-left flex-shrink-0'>
                      {formatTime(currentTime)}
                    </div>
                  )}

                  {/* Progress - flexible */}
                  {!isLiveStream && (
                    <input
                      type='range'
                      min='0'
                      max='100'
                      value={duration ? (currentTime / duration) * 100 : 0}
                      onChange={handleSeek}
                      className='flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer min-w-0'
                    />
                  )}

                  {/* Duration */}
                  {!isLiveStream && (
                    <div className='text-white text-sm font-mono w-12 text-right flex-shrink-0'>
                      {formatTime(duration)}
                    </div>
                  )}
                </div>

                <div className='flex items-center gap-2 ml-2'>
                  <button
                    onClick={togglePlay}
                    className='text-white hover:text-gray-300 transition-colors p-2 bg-gray-800 rounded-full flex items-center justify-center'
                    disabled={isLiveStream}
                    aria-label='Odtwórz / Pauza'
                  >
                    {isPlaying ? (
                      <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
                        <path d='M6 4h4v16H6V4zm8 0h4v16h-4V4z' />
                      </svg>
                    ) : (
                      <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
                        <path d='M8 5v14l11-7z' />
                      </svg>
                    )}
                  </button>

                  <div className='flex items-center space-x-2'>
                    <svg className='w-5 h-5 text-white' fill='currentColor' viewBox='0 0 24 24'>
                      <path d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z' />
                    </svg>
                    <input
                      type='range'
                      min='0'
                      max='100'
                      value={volume * 100}
                      onChange={handleVolumeChange}
                      className='w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer'
                      aria-label='Głośność'
                    />
                  </div>

                  <button
                    onClick={toggleFullscreen}
                    className='text-white hover:text-gray-300 transition-colors p-2 rounded-md'
                    aria-label='Pełny ekran'
                  >
                    <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4' />
                    </svg>
                  </button>
                </div>
              </div>
          </div>
        )}
      </div>
    </div>
  )
}
