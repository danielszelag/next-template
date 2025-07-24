import PageLayout from '@/components/page-layout'

export default function About() {
  return (
    <PageLayout>
      <div className='space-y-16'>
        <div className='text-center'>
          <h1 className='text-4xl md:text-6xl font-light text-gray-900 mb-6'>
            O Nas
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Jesteśmy profesjonalną firmą sprzątającą z wieloletnim
            doświadczeniem. Naszą misją jest zapewnienie najwyższej jakości
            usług sprzątania.
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-16 items-center'>
          <div className='space-y-6'>
            <h2 className='text-3xl font-light text-gray-900'>Nasza Misja</h2>
            <p className='text-gray-600 leading-relaxed'>
              Wierzymy, że czyste otoczenie to podstawa komfortu i zdrowia.
              Nasza firma łączy wieloletnie doświadczenie z nowoczesnymi
              metodami sprzątania, aby zapewnić naszym klientom najwyższą jakość
              usług.
            </p>
            <p className='text-gray-600 leading-relaxed'>
              Od mieszkań prywatnych po duże biura - dostarczamy kompleksowe
              rozwiązania sprzątania dostosowane do indywidualnych potrzeb
              każdego klienta. Nasze usługi są niezawodne, terminowe i
              wykonywane z dbałością o każdy szczegół.
            </p>
          </div>
          <div className='bg-gray-50 rounded-xl p-8 border border-gray-100'>
            <div className='space-y-6'>
              <div>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  Założona
                </h3>
                <p className='text-gray-600'>2018</p>
              </div>
              <div>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  Siedziba
                </h3>
                <p className='text-gray-600'>Warszawa, Polska</p>
              </div>
              <div>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  Zespół
                </h3>
                <p className='text-gray-600'>25+ profesjonalistów</p>
              </div>
              <div>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  Obsłużonych klientów
                </h3>
                <p className='text-gray-600'>Ponad 500</p>
              </div>
            </div>
          </div>
        </div>

        <div className='text-center'>
          <h2 className='text-3xl font-light text-gray-900 mb-8'>
            Nasze Wartości
          </h2>
          <div className='grid md:grid-cols-3 gap-8'>
            <div className='space-y-4'>
              <h3 className='text-xl font-medium text-gray-900'>
                Jakość Przede Wszystkim
              </h3>
              <p className='text-gray-600'>
                Każda usługa wykonywana jest z najwyższą starannością. Używamy
                tylko sprawdzonych metod i środków czyszczących.
              </p>
            </div>
            <div className='space-y-4'>
              <h3 className='text-xl font-medium text-gray-900'>
                Niezawodność
              </h3>
              <p className='text-gray-600'>
                Punktualność i terminowość to nasze priorytety. Możesz na nas
                liczyć - zawsze dotrzymujemy ustalonych terminów.
              </p>
            </div>
            <div className='space-y-4'>
              <h3 className='text-xl font-medium text-gray-900'>Ekologia</h3>
              <p className='text-gray-600'>
                Dbamy o środowisko używając ekologicznych środków czyszczących,
                które są bezpieczne dla Twojej rodziny i planety.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className='text-center bg-gray-50 rounded-2xl p-12'>
          <h2 className='text-3xl font-medium text-gray-900 mb-6'>
            Poznaj Nasz Zespół
          </h2>
          <p className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'>
            Nasi doświadczeni specjaliści są gotowi zadbać o czystość Twojego
            domu lub biura. Skontaktuj się z nami już dziś!
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <a
              href='/dashboard'
              className='bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors'
            >
              Skontaktuj się z nami
            </a>
            <a
              href='/pricing'
              className='border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors'
            >
              Zobacz Cennik
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
