'use client'

import Link from 'next/link'
import { useState } from 'react'

function SprzatanieLogо() {
  return (
    <div className='w-8 h-8 bg-gray-900 rounded flex items-center justify-center'>
      <span className='text-white font-bold text-lg'>S</span>
    </div>
  )
}

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className='bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-6 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <SprzatanieLogо />
            <Link href='/' className='text-xl font-semibold text-gray-900'>
              sprzatanie.tv
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
            <Link
              href='/dashboard'
              className='bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors'
            >
              Twój panel
            </Link>
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
              ? 'max-h-64 opacity-100 mt-4'
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
            <Link
              href='/dashboard'
              className='block bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors text-center'
              onClick={() => setIsMenuOpen(false)}
            >
              Twój panel
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
