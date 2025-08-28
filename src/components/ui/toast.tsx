import { useEffect } from 'react'

type ToastProps = {
  message: string
  type?: 'success' | 'error'
  onClose?: () => void
}

export default function Toast({
  message,
  type = 'success',
  onClose,
}: ToastProps) {
  useEffect(() => {
  const t = setTimeout(() => {
      if (onClose) {
        onClose()
      }
  }, 1000)
    return () => clearTimeout(t)
  }, [onClose])

  const bg = type === 'success' ? 'bg-emerald-600' : 'bg-red-600'

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center pointer-events-none' aria-live='polite'>
      <div
        className={`pointer-events-auto max-w-md w-full mx-4 ${bg} text-white px-6 py-4 rounded-md shadow-lg`}
        role='status'
      >
        <div className='text-sm font-medium text-center'>{message}</div>
      </div>
    </div>
  )
}
