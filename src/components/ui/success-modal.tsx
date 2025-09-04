'use client'

import { useEffect, useState } from 'react'

type SuccessModalProps = {
  isOpen: boolean
  message: string
  onClose: () => void
}

export default function SuccessModal({ isOpen, message, onClose }: SuccessModalProps) {
  const [showCheckmark, setShowCheckmark] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Show checkmark animation after modal appears
      const timer = setTimeout(() => {
        setShowCheckmark(true)
      }, 200)

      // Auto close modal after animation
      const closeTimer = setTimeout(() => {
        onClose()
      }, 2500)

      return () => {
        clearTimeout(timer)
        clearTimeout(closeTimer)
      }
    } else {
      setShowCheckmark(false)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with fade in */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className={`relative bg-white rounded-lg p-8 mx-4 max-w-sm w-full transform transition-all duration-300 ${
        isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        {/* Animated checkmark */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            <div className={`w-16 h-16 rounded-full border-3 border-emerald-500 flex items-center justify-center transform transition-all duration-500 ${
              showCheckmark ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
            }`}>
              {/* Checkmark SVG with draw animation */}
              <svg 
                className="w-8 h-8 text-emerald-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3} 
                  d="M5 13l4 4L19 7"
                  className={`transition-all duration-700 ease-out ${
                    showCheckmark ? 'animate-checkmark-draw' : ''
                  }`}
                  style={{
                    strokeDasharray: '20',
                    strokeDashoffset: showCheckmark ? '0' : '20',
                    transition: 'stroke-dashoffset 0.7s ease-out',
                  }}
                />
              </svg>
            </div>
          </div>
          
          {/* Message */}
          <p className={`text-gray-900 font-medium transition-all duration-500 delay-300 ${
            showCheckmark ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}
