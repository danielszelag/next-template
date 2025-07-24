import PageLayout from '@/components/page-layout'

export default function Features() {
  return (
    <PageLayout>
      <div className='space-y-12'>
        <div className='text-center'>
          <h1 className='text-4xl md:text-6xl font-light text-gray-900 mb-6'>
            Nasze Usługi
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Profesjonalne sprzątanie dostosowane do Twoich potrzeb. Wysoka
            jakość i pełne zaufanie w każdej wizycie.
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-12'>
          <div className='space-y-6'>
            <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
              <svg
                className='w-6 h-6 text-blue-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z'
                />
              </svg>
            </div>
            <h2 className='text-2xl font-medium text-gray-900'>
              Sprzątanie Mieszkań
            </h2>
            <p className='text-gray-600 leading-relaxed'>
              Kompleksowe sprzątanie mieszkań i domów. Odkurzanie, mycie podłóg,
              czyszczenie łazienek i kuchni. Używamy tylko sprawdzonych,
              profesjonalnych środków czyszczących.
            </p>
          </div>

          <div className='space-y-6'>
            <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
              <svg
                className='w-6 h-6 text-green-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                />
              </svg>
            </div>
            <h2 className='text-2xl font-medium text-gray-900'>Pranie Okien</h2>
            <p className='text-gray-600 leading-relaxed'>
              Profesjonalne mycie okien wewnątrz i na zewnątrz. Używamy
              specjalistycznych narzędzi i technik dla idealnej przejrzystości
              bez smug i zabrudzeń.
            </p>
          </div>

          <div className='space-y-6'>
            <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
              <svg
                className='w-6 h-6 text-purple-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                />
              </svg>
            </div>
            <h2 className='text-2xl font-medium text-gray-900'>
              Sprzątanie Biur
            </h2>
            <p className='text-gray-600 leading-relaxed'>
              Profesjonalne sprzątanie przestrzeni biurowych. Utrzymujemy
              czystość i higienę w miejscu pracy, dbając o komfort pracowników i
              pozytywne wrażenie klientów.
            </p>
          </div>

          <div className='space-y-6'>
            <div className='w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center'>
              <svg
                className='w-6 h-6 text-orange-600'
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
            <h2 className='text-2xl font-medium text-gray-900'>
              Gwarancja Jakości
            </h2>
            <p className='text-gray-600 leading-relaxed'>
              Każda usługa objęta jest gwarancją satysfakcji. Jeśli nie jesteś
              zadowolony z rezultatu, poprawimy usługę bezpłatnie lub zwrócimy
              pieniądze.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className='text-center bg-gray-50 rounded-2xl p-12'>
          <h2 className='text-3xl font-medium text-gray-900 mb-6'>
            Gotowy na profesjonalne sprzątanie?
          </h2>
          <p className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'>
            Skontaktuj się z nami już dziś i otrzymaj bezpłatną wycenę
            dostosowaną do Twoich potrzeb.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <a
              href='/pricing'
              className='bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors'
            >
              Zobacz Cennik
            </a>
            <a
              href='/dashboard'
              className='border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors'
            >
              Skontaktuj się
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
