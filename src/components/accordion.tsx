'use client'

import { useState, ReactNode } from 'react'

interface AccordionSectionProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  badge?: string | number
  icon?: ReactNode
}

interface AccordionProps {
  children: ReactNode
}

export function AccordionSection({
  title,
  children,
  defaultOpen = false,
  badge,
  icon,
}: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className='bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full px-8 py-6 flex items-center justify-between hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-300 group'
      >
        <div className='flex items-center space-x-4'>
          {icon && (
            <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110'>
              {icon}
            </div>
          )}
          <div className='text-left'>
            <h2 className='text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300'>
              {title}
            </h2>
            {badge && (
              <div className='mt-1'>
                <span className='bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-sm'>
                  {badge}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className='flex items-center space-x-3'>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              isOpen
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500'
            }`}
          >
            {isOpen ? (
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 15l7-7 7 7'
                />
              </svg>
            ) : (
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            )}
          </div>
        </div>
      </button>

      {isOpen && (
        <div className='border-t border-gray-100 bg-gradient-to-br from-gray-50 to-blue-50/30'>
          <div className='px-8 py-6'>{children}</div>
        </div>
      )}
    </div>
  )
}

export function Accordion({ children }: AccordionProps) {
  return <div className='space-y-6'>{children}</div>
}
