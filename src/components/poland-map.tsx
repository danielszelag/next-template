export default function PolandMap() {
  return (
    <div className='max-w-4xl mx-auto'>
      <h2 className='text-3xl font-medium text-gray-900 mb-12 text-center'>
        Tutaj działamy
      </h2>
      
      {/* Modern location-based approach instead of map */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-center'>
        {/* Location info */}
        <div className='space-y-6'>
          <div className='bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-8 text-white'>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='text-3xl'>📍</div>
              <div>
                <h3 className='text-xl font-semibold'>Główna lokalizacja</h3>
                <p className='text-red-100'>Wrocław, Dolnośląskie</p>
              </div>
            </div>
            <p className='text-red-100 leading-relaxed'>
              Świadczymy profesjonalne usługi sprzątania w całym Wrocławiu 
              oraz w promieniu 30km od miasta.
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='bg-white rounded-xl p-6 border border-gray-200 shadow-sm'>
              <div className='text-2xl mb-3'>🏙️</div>
              <h4 className='font-semibold text-gray-900 mb-2'>Centrum Wrocławia</h4>
              <p className='text-sm text-gray-600'>Stare Miasto, Śródmieście, Nadodrze</p>
            </div>
            
            <div className='bg-white rounded-xl p-6 border border-gray-200 shadow-sm'>
              <div className='text-2xl mb-3'>🏘️</div>
              <h4 className='font-semibold text-gray-900 mb-2'>Dzielnice</h4>
              <p className='text-sm text-gray-600'>Krzyki, Fabryczna, Psie Pole, Biskupin</p>
            </div>
            
            <div className='bg-white rounded-xl p-6 border border-gray-200 shadow-sm'>
              <div className='text-2xl mb-3'>🌆</div>
              <h4 className='font-semibold text-gray-900 mb-2'>Okolice</h4>
              <p className='text-sm text-gray-600'>Oława, Sobótka, Siechnice, Kąty Wrocławskie</p>
            </div>
            
            <div className='bg-white rounded-xl p-6 border border-gray-200 shadow-sm'>
              <div className='text-2xl mb-3'>⚡</div>
              <h4 className='font-semibold text-gray-900 mb-2'>Express</h4>
              <p className='text-sm text-gray-600'>Pilne sprzątanie w ciągu 24h</p>
            </div>
          </div>
        </div>

        {/* Visual representation */}
        <div className='bg-gray-50 rounded-2xl p-8 border border-gray-100'>
          <div className='relative'>
            {/* Simple, clean visual */}
            <div className='w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl relative overflow-hidden'>
              {/* Poland silhouette - very simplified */}
              <div className='absolute inset-4 bg-white rounded-lg shadow-inner flex items-center justify-center'>
                {/* Central Wrocław dot */}
                <div className='relative'>
                  <div className='w-4 h-4 bg-red-600 rounded-full animate-pulse relative z-10'></div>
                  
                  {/* Ripple effect */}
                  <div className='absolute inset-0 w-4 h-4 bg-red-600 rounded-full animate-ping opacity-20'></div>
                  
                  {/* Service area circles */}
                  <div className='absolute -inset-8 border-2 border-red-300 border-dashed rounded-full opacity-50'></div>
                  <div className='absolute -inset-16 border-2 border-red-200 border-dashed rounded-full opacity-30'></div>
                  
                  {/* Label */}
                  <div className='absolute top-6 left-1/2 transform -translate-x-1/2 text-center'>
                    <div className='bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200'>
                      <span className='text-sm font-semibold text-gray-900'>Wrocław</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className='absolute top-4 right-4 text-gray-400'>
                <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/>
                </svg>
              </div>
            </div>
            
            {/* Legend */}
            <div className='mt-6 flex items-center justify-center space-x-6 text-sm text-gray-600'>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-red-600 rounded-full'></div>
                <span>Główna lokalizacja</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 border-2 border-red-300 border-dashed rounded-full'></div>
                <span>Obszar obsługi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className='text-center mt-12'>
        <div className='bg-white rounded-xl border border-gray-200 p-8 shadow-sm'>
          <h3 className='text-xl font-semibold text-gray-900 mb-3'>
            Nie widzisz swojej lokalizacji?
          </h3>
          <p className='text-gray-600 mb-6'>
            Skontaktuj się z nami - możemy rozszerzyć obszar działania dla stałych klientów
          </p>
          <button className='bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors'>
            Sprawdź dostępność
          </button>
        </div>
      </div>
    </div>
  )
}
