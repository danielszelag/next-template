// Cloudflare Stream API utilities
// This will be used when integrating with actual Cloudflare Stream

export interface StreamVideo {
  uid: string
  thumbnail: string
  thumbnailTimestampPct: number
  readyToStream: boolean
  status: {
    state: string
    pctComplete: string
  }
}

export interface LiveInput {
  uid: string
  rtmps: {
    url: string
    streamKey: string
  }
  rtmpsPlayback: {
    url: string
  }
  srt: {
    url: string
    streamId: string
  }
  webRTC: {
    url: string
  }
  status: string
}

// Mock API responses for development
export const mockStreamAPI = {
  // Get user's recordings
  async getUserRecordings(): Promise<StreamVideo[]> {
    // In production, this would make actual API calls to Cloudflare Stream
    // The userId parameter would be used to filter recordings by user
    return [
      {
        uid: 'abc123',
        thumbnail:
          'https://customer-stream.cloudflarestream.com/abc123/thumbnails/thumbnail.jpg',
        thumbnailTimestampPct: 0.5,
        readyToStream: true,
        status: {
          state: 'ready',
          pctComplete: '100',
        },
      },
    ]
  },

  // Create live input for new cleaning session
  async createLiveInput(sessionId: string): Promise<LiveInput> {
    return {
      uid: `live_${sessionId}`,
      rtmps: {
        url: 'rtmps://live.cloudflarestream.com/live/',
        streamKey: `${sessionId}_stream_key`,
      },
      rtmpsPlayback: {
        url: `https://customer-stream.cloudflarestream.com/live_${sessionId}/manifest/video.m3u8`,
      },
      srt: {
        url: 'srt://live.cloudflarestream.com:778',
        streamId: `${sessionId}_srt`,
      },
      webRTC: {
        url: `https://customer-stream.cloudflarestream.com/live_${sessionId}/webrtc/play`,
      },
      status: 'connected',
    }
  },

  // End live session and get recording
  async endLiveSession(liveInputId: string): Promise<StreamVideo> {
    return {
      uid: liveInputId.replace('live_', 'recording_'),
      thumbnail: `https://customer-stream.cloudflarestream.com/${liveInputId}/thumbnails/thumbnail.jpg`,
      thumbnailTimestampPct: 0.5,
      readyToStream: true,
      status: {
        state: 'ready',
        pctComplete: '100',
      },
    }
  },
}

// Production API functions (commented out for now)
/*
export class CloudflareStreamAPI {
  private apiToken: string
  private accountId: string

  constructor(apiToken: string, accountId: string) {
    this.apiToken = apiToken
    this.accountId = accountId
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/stream/${endpoint}`,
      {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      }
    )
    return response.json()
  }

  async createLiveInput(sessionId: string) {
    return this.request('live_inputs', {
      method: 'POST',
      body: JSON.stringify({
        meta: { sessionId },
        recording: { mode: 'automatic' }
      })
    })
  }

  async listVideos() {
    return this.request('videos')
  }

  async getVideo(videoId: string) {
    return this.request(`videos/${videoId}`)
  }
}
*/
