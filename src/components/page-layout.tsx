interface PageLayoutProps {
  children: React.ReactNode
  className?: string
}

export default function PageLayout({
  children,
  className = '',
}: PageLayoutProps) {
  return (
    <div className={`bg-white min-h-screen ${className}`}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12'>
        {children}
      </div>
    </div>
  )
}
