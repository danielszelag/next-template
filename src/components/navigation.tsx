'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from '@clerk/nextjs'

function SprzatanieLogо() {
  return (
    <div className='w-8 h-8 bg-gray-900 rounded flex items-center justify-center'>
      <span className='text-white font-bold text-lg'>S</span>
    </div>
  )
}

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { user } = useUser()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  return (
    <nav className='bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-6 py-4' ref={menuRef}>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <SprzatanieLogо />
            <Link href='/' className='text-xl font-semibold text-gray-900'>
              sprzatamy.live
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className='hidden md:flex items-center space-x-8'>
            <Link
              href='/features'
              className='text-gray-600 hover:text-gray-900 transition-colors'
            >
              Usługi
            </Link>
            <Link
              href='/pricing'
              className='text-gray-600 hover:text-gray-900 transition-colors'
            >
              Cennik
            </Link>
            <Link
              href='/about'
              className='text-gray-600 hover:text-gray-900 transition-colors'
            >
              O nas
            </Link>

            {/* Auth Section */}
            <SignedOut>
              <SignInButton mode='modal' forceRedirectUrl='/dashboard'>
                <button className='bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium'>
                  Zaloguj się
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link
                href='/dashboard'
                className='text-gray-600 hover:text-gray-900 transition-colors'
              >
                Twój panel
              </Link>
              <div className='flex items-center space-x-3'>
                <div className='flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full'>
                  <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                  <span className='text-sm font-medium text-gray-700'>
                    {user?.firstName ||
                      user?.emailAddresses[0]?.emailAddress?.split('@')[0] ||
                      'Użytkownik'}
                  </span>
                </div>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: 'w-8 h-8',
                    },
                  }}
                />
              </div>
            </SignedIn>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className='md:hidden p-2'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label='Toggle menu'
          >
            <div className='w-6 h-6 flex flex-col justify-center items-center space-y-1'>
              <span
                className={`block w-5 h-0.5 bg-gray-900 transition-all duration-300 origin-center ${
                  isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-gray-900 transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-gray-900 transition-all duration-300 origin-center ${
                  isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? 'max-h-80 opacity-100 mt-4'
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className='py-4 space-y-4 border-t border-gray-100'>
            <Link
              href='/features'
              className='block text-gray-600 hover:text-gray-900 transition-colors px-6 py-3 text-center'
              onClick={() => setIsMenuOpen(false)}
            >
              Usługi
            </Link>
            <Link
              href='/pricing'
              className='block text-gray-600 hover:text-gray-900 transition-colors px-6 py-3 text-center'
              onClick={() => setIsMenuOpen(false)}
            >
              Cennik
            </Link>
            <Link
              href='/about'
              className='block text-gray-600 hover:text-gray-900 transition-colors px-6 py-3 text-center'
              onClick={() => setIsMenuOpen(false)}
            >
              O nas
            </Link>

            {/* Mobile Auth Section */}
            <SignedOut>
              <div className='px-6'>
                <SignInButton mode='modal' forceRedirectUrl='/dashboard'>
                  <button className='w-full bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium'>
                    Zaloguj się
                  </button>
                </SignInButton>
              </div>
            </SignedOut>

            <SignedIn>
              <div className='px-6 space-y-3'>
                <div className='flex items-center justify-center space-x-2 bg-gray-50 px-4 py-2 rounded-full'>
                  <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                  <span className='text-sm font-medium text-gray-700'>
                    {user?.firstName ||
                      user?.emailAddresses[0]?.emailAddress?.split('@')[0] ||
                      'Użytkownik'}
                  </span>
                </div>
                <Link
                  href='/dashboard'
                  className='block bg-gray-100 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors text-center font-medium'
                  onClick={() => setIsMenuOpen(false)}
                >
                  Twój panel
                </Link>
                <div className='flex justify-center'>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: 'w-10 h-10',
                      },
                    }}
                  />
                </div>
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  )
}
