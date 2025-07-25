import React from 'react'
import GreenTickIcon from './icons/GreenTickIcon'

interface PricingCardProps {
  title: string
  price?: number
  description: string
  features?: string[]
  isSelected?: boolean
  buttonText?: string
  buttonStyle?: 'default' | 'primary'
  badge?: string
  priceDisplay?: React.ReactNode
  onClick?: () => void
}

export default function PricingCard({
  title,
  price,
  description,
  features = [],
  isSelected = false,
  buttonText = 'Get Started',
  buttonStyle = 'default',
  badge,
  priceDisplay,
  onClick,
}: PricingCardProps) {
  const buttonClasses =
    buttonStyle === 'primary'
      ? 'w-full mt-8 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors'
      : 'w-full mt-8 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors'

  return (
    <div
      className={`rounded-xl border-2 p-8 relative transition-all cursor-pointer hover:shadow-lg flex flex-col h-full ${
        isSelected ? 'border-gray-900' : 'border-gray-100 hover:border-gray-200'
      }`}
      onClick={onClick}
    >
      {badge && (
        <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
          <span className='bg-gray-900 text-white px-4 py-1 rounded-full text-sm'>
            {badge}
          </span>
        </div>
      )}

      <div className='text-center space-y-4'>
        <h3 className='text-2xl font-medium text-gray-900'>{title}</h3>
        <div>
          {priceDisplay || (
            <>
              <span className='text-4xl font-light text-gray-900'>
                {price} zł
              </span>
              <span className='text-gray-600'>/miesiąc</span>
            </>
          )}
        </div>
        <p className='text-gray-600'>{description}</p>
      </div>
      <div className='mt-8 space-y-4 flex-grow'>
        {features.map((feature, index) => (
          <div key={index} className='flex items-center'>
            <GreenTickIcon />
            <span className='text-gray-600'>{feature}</span>
          </div>
        ))}
      </div>
      <button
        className={buttonClasses}
        onClick={(e) => {
          e.stopPropagation()
          onClick?.()
        }}
      >
        {buttonText}
      </button>
    </div>
  )
}
