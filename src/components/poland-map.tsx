export default function PolandMap() {
  return (
    <div className='max-w-2xl mx-auto'>
      <h2 className='text-3xl font-medium text-gray-900 mb-12 text-center'>
        Tutaj działamy
      </h2>
      <div className='relative bg-gray-50 rounded-2xl p-12 border border-gray-100'>
        <svg
          viewBox='0 0 600 500'
          className='w-full h-auto max-w-xl mx-auto'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          {/* Poland outline - more accurate shape */}
          <path
            d='M 100 180 
               L 120 160 
               L 140 150 
               L 170 140 
               L 200 135 
               L 230 130 
               L 260 125 
               L 290 120 
               L 320 118 
               L 350 115 
               L 380 118 
               L 410 125 
               L 440 135 
               L 470 150 
               L 490 170 
               L 500 190 
               L 505 210 
               L 500 230 
               L 490 250 
               L 480 270 
               L 465 290 
               L 450 305 
               L 430 320 
               L 410 330 
               L 390 340 
               L 370 350 
               L 350 355 
               L 330 360 
               L 310 365 
               L 290 368 
               L 270 370 
               L 250 369 
               L 230 366 
               L 210 360 
               L 190 352 
               L 170 340 
               L 155 325 
               L 145 308 
               L 138 290 
               L 135 270 
               L 132 250 
               L 130 230 
               L 125 210 
               L 118 195 
               L 108 185 
               Z'
            fill='#f3f4f6'
            stroke='#9ca3af'
            strokeWidth='3'
            strokeLinejoin='round'
          />

          {/* Wrocław dot - positioned in Lower Silesia (southwestern Poland) */}
          <circle
            cx='220'
            cy='300'
            r='12'
            fill='#dc2626'
            stroke='#ffffff'
            strokeWidth='3'
            className='animate-pulse'
          />

          {/* Wrocław label */}
          <text
            x='220'
            y='335'
            textAnchor='middle'
            className='fill-gray-900 font-semibold'
            fontSize='18'
          >
            Wrocław
          </text>

          {/* Add some major cities for reference */}
          <circle cx='300' cy='160' r='4' fill='#6b7280' />
          <text
            x='300'
            y='150'
            textAnchor='middle'
            className='fill-gray-600'
            fontSize='12'
          >
            Warszawa
          </text>

          <circle cx='180' cy='200' r='4' fill='#6b7280' />
          <text
            x='180'
            y='190'
            textAnchor='middle'
            className='fill-gray-600'
            fontSize='12'
          >
            Poznań
          </text>

          <circle cx='410' cy='220' r='4' fill='#6b7280' />
          <text
            x='410'
            y='210'
            textAnchor='middle'
            className='fill-gray-600'
            fontSize='12'
          >
            Kraków
          </text>

          <circle cx='450' cy='180' r='4' fill='#6b7280' />
          <text
            x='450'
            y='170'
            textAnchor='middle'
            className='fill-gray-600'
            fontSize='12'
          >
            Gdańsk
          </text>
        </svg>

        <div className='text-center mt-8'>
          <p className='text-gray-600 leading-relaxed'>
            Świadczymy profesjonalne usługi sprzątania w całym Wrocławiu i
            okolicach. Skontaktuj się z nami, aby poznać dostępność w Twojej
            dzielnicy.
          </p>
        </div>
      </div>
    </div>
  )
}
