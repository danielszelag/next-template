'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

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
            <Link href='/' className='text-xl font-semibold text-gray-900'>
              cleanrecord.pl
            </Link>
          </div>

          <div className='flex items-center space-x-4'>
            {/* Desktop Menu */}
            <div className='hidden md:flex items-center space-x-8'>
              <Link
                href='/features'
                className='text-gray-600 hover:text-gray-900 transition-colors font-bold'
              >
                Jak to działa
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
                  className='bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-bold'
                >
                  Twój panel
                </Link>
              </SignedIn>
            </div>

            {/* Avatar - positioned at far right */}
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8',
                  },
                }}
              />
            </SignedIn>

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
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-out overflow-hidden ${
            isMenuOpen ? 'max-h-80 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div
            className={`border-t border-gray-100 transition-transform duration-300 ease-out ${
              isMenuOpen ? 'translate-y-0' : '-translate-y-4'
            }`}
          >
            <Link
              href='/features'
              className='block text-gray-600 hover:text-gray-900 transition-colors px-6 py-3 text-center font-bold'
              onClick={() => setIsMenuOpen(false)}
            >
              Jak to działa
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
              <div className='px-6'>
                <Link
                  href='/dashboard'
                  className='block bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors text-center font-bold'
                  onClick={() => setIsMenuOpen(false)}
                >
                  Twój panel
                </Link>
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  )
}
