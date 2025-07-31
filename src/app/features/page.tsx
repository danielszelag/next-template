import PageLayout from '@/components/page-layout'

export default function Features() {
  const steps = [
    {
      number: '01',
      title: 'Wybierz usługę',
      description: 'Przeglądaj nasze pakiety sprzątania i wybierz ten, który najlepiej odpowiada Twoim potrzebom. Standardowe, głębokie czy specjalistyczne - mamy coś dla każdego.',
      icon: (
        <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' />
        </svg>
      ),
      color: 'blue'
    },
    {
      number: '02',
      title: 'Zarezerwuj termin',
      description: 'Wybierz dogodny dla Ciebie termin i potwierdź rezerwację. Otrzymasz szczegółowe instrukcje dotyczące przygotowania kamery do nagrywania.',
      icon: (
        <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
        </svg>
      ),
      color: 'green'
    },
    {
      number: '03',
      title: 'Ustaw kamerę',
      description: 'Przed przyjściem sprzątaczki ustaw kamerę w dogodnym miejscu. Dzięki temu będziesz mieć pełny wgląd w proces sprzątania w czasie rzeczywistym.',
      icon: (
        <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' />
        </svg>
      ),
      color: 'purple'
    },
    {
      number: '04',
      title: 'Wpuść sprzątaczkę',
      description: 'W umówionym terminie wpuść naszą profesjonalną sprzątaczkę. Możesz wyjść z domu wiedząc, że wszystko jest nagrywane i monitorowane.',
      icon: (
        <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z' />
        </svg>
      ),
      color: 'orange'
    },
    {
      number: '05',
      title: 'Oglądaj na żywo',
      description: 'Przez całą usługę możesz obserwować postępy sprzątania na żywo przez naszą aplikację. Pełna transparentność i kontrola nad procesem.',
      icon: (
        <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
        </svg>
      ),
      color: 'red'
    },
    {
      number: '06',
      title: 'Odbierz nagranie',
      description: 'Po zakończeniu usługi otrzymujesz dostęp do pełnego nagrania. Możesz je oglądać w dowolnym momencie jako potwierdzenie jakości wykonanych prac.',
      icon: (
        <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 3v11a2 2 0 002 2h8a2 2 0 002-2V7m-9 0h10M9 11v6m6-6v6' />
        </svg>
      ),
      color: 'indigo'
    }
  ]

  const getColorClasses = (color: string, variant: 'bg' | 'text' | 'border') => {
    const colorMap = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
      red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200' }
    }
    return colorMap[color as keyof typeof colorMap][variant]
  }

  return (
    <PageLayout>
      <div className='space-y-16'>
        {/* Header */}
        <div className='text-center'>
          <h1 className='text-4xl md:text-6xl font-light text-gray-900 mb-6'>
            Jak to działa?
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Prosty, przejrzysty proces od zamówienia do odbioru nagrania. 
            Pełna kontrola i transparentność w każdym kroku.
          </p>
        </div>

        {/* Simple Step Cards Timeline */}
        <div className='space-y-8'>
          {steps.map((step, index) => (
            <div key={step.number} className='relative'>
              {/* Step card */}
              <div className='bg-white rounded-xl p-6 shadow-lg border-l-4 border-gray-200 hover:shadow-xl transition-all duration-300'>
                {/* Header */}
                <div className='flex items-start space-x-4 mb-4'>
                  <div className={`w-12 h-12 ${getColorClasses(step.color, 'bg')} rounded-full flex items-center justify-center flex-shrink-0 shadow-md`}>
                    <span className='text-white font-bold text-lg'>{step.number}</span>
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                      {step.title}
                    </h3>
                    <p className='text-gray-600 leading-relaxed'>
                      {step.description}
                    </p>
                  </div>
                  <div className={`${getColorClasses(step.color, 'text')} flex-shrink-0`}>
                    {step.icon}
                  </div>
                </div>

                {/* Progress indicator */}
                {index < steps.length - 1 && (
                  <div className='flex items-center justify-center mt-6'>
                    <div className='flex items-center space-x-2 text-gray-400'>
                      <div className='w-2 h-2 bg-gray-300 rounded-full'></div>
                      <div className='w-2 h-2 bg-gray-300 rounded-full'></div>
                      <div className='w-2 h-2 bg-gray-300 rounded-full'></div>
                      <svg className='w-4 h-4 ml-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m0 0l7-7' />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className='text-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-12'>
          <div className='max-w-3xl mx-auto'>
            <h2 className='text-3xl md:text-4xl font-light text-gray-900 mb-6'>
              Gotowy na przejrzyste sprzątanie?
            </h2>
            <p className='text-xl text-gray-600 mb-8'>
              Dołącz do setek zadowolonych klientów, którzy wybierają nasze 
              bezpieczne i transparentne usługi sprzątania.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <a
                href='/pricing'
                className='bg-gray-900 text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 font-medium'
              >
                Zobacz Cennik
              </a>
              <a
                href='/dashboard'
                className='border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:bg-white hover:border-gray-400 transition-all duration-200 transform hover:scale-105 font-medium'
              >
                Zacznij Teraz
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
