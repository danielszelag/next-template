'use client'

import { useState, useEffect } from 'react'

interface LiveStreamViewerProps {
  streamId: string | null
  cloudflareLiveInputId: string | null
  title?: string
  isLive?: boolean
}

interface StreamStatus {
  status: 'connected' | 'disconnected' | 'unknown'
  viewerCount?: number
}

export default function LiveStreamViewer({
  streamId,
  cloudflareLiveInputId,
  title = 'Live Stream',
  isLive = false,
}: LiveStreamViewerProps) {
  const [streamStatus, setStreamStatus] = useState<StreamStatus>({
    status: 'unknown',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout

    const checkStreamStatus = async () => {
      if (!cloudflareLiveInputId) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          `/api/stream/status/${cloudflareLiveInputId}`
        )
        if (response.ok) {
          const data = (await response.json()) as {
            status?: string
            viewerCount?: number
          }
          setStreamStatus({
            status:
              (data.status as 'connected' | 'disconnected' | 'unknown') ||
              'unknown',
            viewerCount: data.viewerCount,
          })
        } else {
          setError('Failed to check stream status')
        }
      } catch (err) {
        setError('Error checking stream status')
        console.error('Stream status error:', err)
      } finally {
        setLoading(false)
      }
    }

    // Check status immediately
    checkStreamStatus()

    // Check status every 30 seconds if live
    if (isLive || cloudflareLiveInputId) {
      interval = setInterval(checkStreamStatus, 30000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [cloudflareLiveInputId, isLive])

  if (loading) {
    return (
      <div className='bg-gray-900 rounded-lg aspect-video flex items-center justify-center'>
        <div className='text-white'>Loading stream...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='bg-gray-900 rounded-lg aspect-video flex items-center justify-center'>
        <div className='text-red-400'>{error}</div>
      </div>
    )
  }

  // For recorded videos (streamId available)
  if (streamId && !isLive) {
    return (
      <div className='w-full'>
        <div className='bg-gray-900 rounded-lg overflow-hidden'>
          <iframe
            src={`https://iframe.cloudflarestream.com/${streamId}`}
            style={{
              border: 'none',
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '100%',
            }}
            className='aspect-video w-full'
            allow='accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;'
            allowFullScreen
          />
        </div>
        {title && (
          <h3 className='mt-2 text-lg font-medium text-gray-900'>{title}</h3>
        )}
      </div>
    )
  }

  // For live streams
  if (cloudflareLiveInputId && isLive) {
    const isStreamActive = streamStatus.status === 'connected'

    return (
      <div className='w-full'>
        <div className='relative bg-gray-900 rounded-lg overflow-hidden'>
          {isStreamActive ? (
            <iframe
              src={`https://iframe.cloudflarestream.com/${cloudflareLiveInputId}`}
              style={{
                border: 'none',
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
              }}
              className='aspect-video w-full'
              allow='accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;'
              allowFullScreen
            />
          ) : (
            <div className='aspect-video flex items-center justify-center'>
              <div className='text-center text-white'>
                <div className='text-xl mb-2'>📹</div>
                <div className='text-lg font-medium'>Stream Offline</div>
                <div className='text-sm text-gray-400'>
                  {streamStatus.status === 'disconnected'
                    ? 'Stream is currently disconnected'
                    : 'Waiting for stream to start...'}
                </div>
              </div>
            </div>
          )}

          {/* Live indicator */}
          {isStreamActive && (
            <div className='absolute top-4 left-4'>
              <div className='flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium'>
                <div className='w-2 h-2 bg-white rounded-full animate-pulse'></div>
                <span>LIVE</span>
                {streamStatus.viewerCount && (
                  <span>• {streamStatus.viewerCount} viewers</span>
                )}
              </div>
            </div>
          )}
        </div>

        {title && (
          <div className='mt-2 flex items-center justify-between'>
            <h3 className='text-lg font-medium text-gray-900'>{title}</h3>
            <div className='text-sm text-gray-500'>
              Status:{' '}
              <span
                className={`font-medium ${
                  streamStatus.status === 'connected'
                    ? 'text-green-600'
                    : streamStatus.status === 'disconnected'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}
              >
                {streamStatus.status}
              </span>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Fallback for no stream data
  return (
    <div className='bg-gray-100 rounded-lg aspect-video flex items-center justify-center'>
      <div className='text-center text-gray-500'>
        <div className='text-2xl mb-2'>📹</div>
        <div>No stream available</div>
      </div>
    </div>
  )
}
