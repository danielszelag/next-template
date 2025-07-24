export default function Home() {
  return (
    <div className='bg-white'>
      {/* Hero Section */}
      <main className='relative'>
        <div className='max-w-7xl mx-auto px-6 pt-24 pb-32'>
          <div className='text-center'>
            <div className='inline-flex items-center px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-600 mb-8'>
              <span className='w-2 h-2 bg-green-500 rounded-full mr-2'></span>
              Now live on Cloudflare
            </div>

            <h1 className='text-5xl md:text-7xl font-light text-gray-900 mb-8 leading-tight'>
              My sprzątamy
              <span className='block font-medium text-gray-700'></span>
            </h1>

            <p className='text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light'>
              Ty oglądasz
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-20'>
              <button className='bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors'>
                Start Building
              </button>
              <button className='border border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors'>
                View Demo
              </button>
            </div>

            {/* Feature Cards Grid */}
            <div className='grid md:grid-cols-3 gap-8'>
              <div className='p-8 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-300'>
                <div className='w-12 h-12 bg-gray-100 rounded-lg mb-6 flex items-center justify-center'>
                  <svg
                    className='w-6 h-6 text-gray-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M13 10V3L4 14h7v7l9-11h-7z'
                    />
                  </svg>
                </div>
                <h3 className='text-xl font-medium text-gray-900 mb-4'>
                  Lightning Fast
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  Deployed on Cloudflare&apos;s global edge network for instant
                  loading worldwide.
                </p>
              </div>

              <div className='p-8 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-300'>
                <div className='w-12 h-12 bg-gray-100 rounded-lg mb-6 flex items-center justify-center'>
                  <svg
                    className='w-6 h-6 text-gray-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <h3 className='text-xl font-medium text-gray-900 mb-4'>
                  Type Safe
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  Built with TypeScript and modern tooling for reliable
                  development.
                </p>
              </div>

              <div className='p-8 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-300'>
                <div className='w-12 h-12 bg-gray-100 rounded-lg mb-6 flex items-center justify-center'>
                  <svg
                    className='w-6 h-6 text-gray-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                    />
                  </svg>
                </div>
                <h3 className='text-xl font-medium text-gray-900 mb-4'>
                  Developer Experience
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  Hot reload, excellent tooling, and everything you need to
                  build amazing apps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Stats Section */}
      <section className='py-20 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='grid md:grid-cols-4 gap-8 text-center'>
            <div>
              <div className='text-3xl font-semibold text-gray-900 mb-2'>
                99.9%
              </div>
              <div className='text-gray-600'>Uptime</div>
            </div>
            <div>
              <div className='text-3xl font-semibold text-gray-900 mb-2'>
                &lt;100ms
              </div>
              <div className='text-gray-600'>Response Time</div>
            </div>
            <div>
              <div className='text-3xl font-semibold text-gray-900 mb-2'>
                200+
              </div>
              <div className='text-gray-600'>Edge Locations</div>
            </div>
            <div>
              <div className='text-3xl font-semibold text-gray-900 mb-2'>
                10M+
              </div>
              <div className='text-gray-600'>Requests/Day</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
