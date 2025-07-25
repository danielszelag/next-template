'use client'

import PolandMap from '@/components/poland-map'
import { useUser, SignedIn, SignedOut } from '@clerk/nextjs'

export default function Home() {
  const { user } = useUser()

  return (
    <div className='bg-white'>
      {/* Hero Section */}
      <main className='relative'>
        <div className='max-w-7xl mx-auto px-6 pt-24 pb-32'>
          <div className='text-center'>
            <div className='inline-flex items-center px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-600 mb-8'>
              <span className='w-2 h-2 bg-green-500 rounded-full mr-2'></span>
              <SignedOut>Now live on Cloudflare</SignedOut>
              <SignedIn>
                Witaj z powrotem, {user?.firstName || 'Użytkowniku'}!
              </SignedIn>
            </div>

            <h1 className='text-5xl md:text-7xl font-light text-gray-900 mb-8 leading-tight'>
              <span className='block font-medium text-gray-700'>
                My sprzątamy,
              </span>
              <span className='block font-medium text-gray-700'>
                Ty oglądasz.
              </span>
            </h1>

            {/* Service Area Map */}
            <PolandMap />
          </div>
        </div>
      </main>
    </div>
  )
}
