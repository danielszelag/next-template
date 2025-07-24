import Link from 'next/link'

function SprzatanieLogо() {
  return (
    <div className='w-8 h-8 bg-gray-900 rounded flex items-center justify-center'>
      <span className='text-white font-bold text-lg'>S</span>
    </div>
  )
}

export default function Navigation() {
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
        </div>
      </div>
    </nav>
  )
}
