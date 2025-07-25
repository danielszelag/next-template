'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useAuthRedirect() {
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Check if we're on a page that should redirect after sign-in
      const currentPath = window.location.pathname
      if (
        currentPath === '/' ||
        currentPath.includes('sign-in') ||
        currentPath.includes('sign-up')
      ) {
        router.push('/dashboard')
      }
    }
  }, [isSignedIn, isLoaded, router])
}
