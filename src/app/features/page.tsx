'use client'
import PageLayout from '@/components/page-layout'
import { useState } from 'react'

export default function Features() {
  const [openStep, setOpenStep] = useState<string | null>('01')
  const steps = [
    {
      number: '01',
      title: 'Wybierz usługę',
      description: 'Przeglądaj nasze pakiety sprzątania i wybierz ten, który najlepiej odpowiada Twoim potrzebom. Standardowe, głębokie czy specjalistyczne - mamy coś dla każdego.',
      color: 'blue'
    },
    {
      number: '02',
      title: 'Zarezerwuj termin',
      description: 'Wybierz dogodny dla Ciebie termin i potwierdź rezerwację. Otrzymasz szczegółowe instrukcje dotyczące przygotowania kamery do nagrywania.',
      color: 'green'
    },
    {
      number: '03',
      title: 'Ustaw kamerę',
      description: 'Przed przyjściem sprzątaczki ustaw kamerę w dogodnym miejscu. Dzięki temu będziesz mieć pełny wgląd w proces sprzątania w czasie rzeczywistym.',
      color: 'purple'
    },
    {
      number: '04',
      title: 'Wpuść sprzątaczkę',
      description: 'W umówionym terminie wpuść naszą profesjonalną sprzątaczkę. Możesz wyjść z domu wiedząc, że wszystko jest nagrywane i monitorowane.',
      color: 'orange'
    },
    {
      number: '05',
      title: 'Oglądaj na żywo',
      description: 'Przez całą usługę możesz obserwować postępy sprzątania na żywo przez naszą aplikację. Pełna transparentność i kontrola nad procesem.',
      color: 'red'
    },
    {
      number: '06',
      title: 'Odbierz nagranie',
      description: 'Po zakończeniu usługi otrzymujesz dostęp do pełnego nagrania. Możesz je oglądać w dowolnym momencie jako potwierdzenie jakości wykonanych prac.',
      color: 'indigo'
    }
  ]

  const getColorClasses = (color: string, variant: 'bg' | 'text' | 'border') => {
    const colorMap = {
      blue: { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-200' },
      green: { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-200' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-200' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-200' },
      red: { bg: 'bg-red-500', text: 'text-red-600', border: 'border-red-200' },
      indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600', border: 'border-indigo-200' }
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

        {/* Accordion Steps */}
        <div className='space-y-4'>
          {steps.map((step, index) => (
            <div key={step.number} className='bg-white rounded-xl shadow-lg overflow-hidden'>
              {/* Accordion Header */}
              <button
                onClick={() => setOpenStep(openStep === step.number ? null : step.number)}
                className='w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200'
              >
                <div className='flex items-center space-x-4'>
                  <div className={`w-10 h-10 ${getColorClasses(step.color, 'bg')} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <span className='text-white font-bold text-sm'>{step.number}</span>
                  </div>
                  <h3 className='text-lg font-semibold text-gray-900 text-left'>
                    {step.title}
                  </h3>
                </div>
                <div className='flex items-center space-x-3'>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      openStep === step.number ? 'rotate-180' : ''
                    }`}
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                  </svg>
                </div>
              </button>

              {/* Accordion Content */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openStep === step.number ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className='px-6 pb-6 pt-2'>
                  <div className={`border-l-4 ${getColorClasses(step.color, 'border')} pl-4 ml-5`}>
                    <p className='text-gray-600 leading-relaxed'>
                      {step.description}
                    </p>
                  </div>
                  
                  {/* Progress bar */}
                  <div className='mt-4 ml-5'>
                    <div className='flex items-center justify-between text-sm text-gray-500 mb-2'>
                      <span>Postęp</span>
                      <span>{index + 1}/{steps.length}</span>
                    </div>
                    <div className='w-full bg-gray-200 rounded-full h-2'>
                      <div 
                        className={`${getColorClasses(step.color, 'bg')} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${((index + 1) / steps.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
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
