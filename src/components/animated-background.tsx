'use client'
export default function AnimatedBackground({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='relative min-h-screen overflow-hidden'>
      {/* Animated CSS Background */}
      <div className='absolute top-0 left-0 w-full h-full z-0'>
        <div className='absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-gray-50'></div>
        <div className='absolute inset-0 opacity-30'>
          <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-blob'></div>
          <div className='absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000'></div>
          <div className='absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000'></div>
        </div>
      </div>

      {/* Content */}
      <div className='relative z-10'>{children}</div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
