import AnimatedBackground from '@/components/animated-background'

export default function BackgroundTest() {
  return (
    <AnimatedBackground>
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center bg-white/80 backdrop-blur-sm rounded-2xl p-12 max-w-2xl mx-auto'>
          <h1 className='text-4xl md:text-6xl font-light text-gray-900 mb-6'>
            Background Test
          </h1>
          <p className='text-xl text-gray-600 mb-8'>
            This page demonstrates the animated background effect in full
            screen.
          </p>
          <div className='space-y-4'>
            <p className='text-gray-600'>
              You should see floating, animated blobs moving slowly behind this
              content.
            </p>
            <p className='text-gray-600'>
              The background features a gradient with soft, colorful shapes that
              blend together.
            </p>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  )
}
