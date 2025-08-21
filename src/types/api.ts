// API Response Types

export interface Address {
  id: string
  userId: string
  name: string
  street: string
  postalCode: string
  city: string
  createdAt: string | Date
  updatedAt: string | Date
}

export interface UserProfile {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  language: string
  accountBalance: number
  createdAt: string | Date
  updatedAt: string | Date
}

export interface CleaningSession {
  id: string
  userId: string
  addressId: string | null
  streamId: string | null
  liveInputId: string | null
  cleanerName: string
  cleanerAvatar: string | null
  serviceType: string
  scheduledTime: string | Date | null
  startTime: string | Date | null
  endTime: string | Date | null
  duration: number | null
  status: string
  previewImageUrl: string | null
  recordingUrl: string | null
  liveStreamUrl: string | null
  isRecorded: boolean | null
  streamTitle: string | null
  streamDescription: string | null
  viewerCount: number | null
  chatEnabled: boolean | null
  price: number | null
  rating: number | null
  review: string | null
  createdAt: string | Date
  updatedAt: string | Date
}

// API Request Types
export interface CreateAddressRequest {
  name: string
  street: string
  postalCode: string
  city: string
}

export interface CreateProfileRequest {
  firstName: string
  lastName: string
  email: string
  phone?: string
  language?: string
}

// API Error Response
export interface ApiError {
  error: string
}
