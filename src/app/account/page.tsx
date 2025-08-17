'use client'

import { useState, useEffect } from 'react'
import PageLayout from '@/components/page-layout'

const AccordionSection = ({
  id,
  title,
  icon,
  children,
  //   defaultOpen = false,
  isOpen,
  onToggle,
}: {
  id: string
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
  isOpen: boolean
  onToggle: (id: string) => void
}) => {
  return (
    <div className='border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-4'>
      <button
        onClick={() => onToggle(id)}
        className='w-full px-6 py-4 bg-white hover:bg-gray-50 transition-all duration-200 text-left flex items-center justify-between group'
      >
        <div className='flex items-center space-x-3'>
          {icon && (
            <div
              className={`text-gray-600 transition-colors duration-200 ${
                isOpen ? 'text-gray-900' : ''
              }`}
            >
              {icon}
            </div>
          )}
          <div>
            <h3
              className={`text-lg font-semibold transition-colors duration-200 ${
                isOpen ? 'text-gray-900' : 'text-gray-700'
              }`}
            >
              {title}
            </h3>
          </div>
        </div>
        <div
          className={`transition-all duration-300 ease-in-out ${
            isOpen ? 'rotate-180 text-gray-900' : 'text-gray-400'
          }`}
        >
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
        </div>
      </button>
      {isOpen && (
        <div className='px-6 pb-6 bg-gray-50 border-t border-gray-200'>
          {children}
        </div>
      )}
    </div>
  )
}

export default function AccountPage() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    profile: true,
  })
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addresses, setAddresses] = useState<
    Array<{
      id: string
      name: string
      street: string
      postalCode: string
      city: string
    }>
  >([])
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    postalCode: '',
    city: '',
  })

  // Check URL parameters to auto-open specific sections
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const section = urlParams.get('section')
    if (section === 'addresses') {
      setOpenSections(prev => ({
        ...prev,
        addresses: true,
        profile: false, // Close profile section to focus on addresses
      }))
    }
  }, [])

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault()
    if (
      formData.name &&
      formData.street &&
      formData.postalCode &&
      formData.city
    ) {
      const newAddress = {
        id: Date.now().toString(),
        ...formData,
      }
      setAddresses([newAddress, ...addresses])
      setFormData({ name: '', street: '', postalCode: '', city: '' })
      setShowAddressForm(false)
    }
  }

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  return (
    <PageLayout>
      <div className='max-w-4xl mx-auto'>
        <div className='space-y-4'>
          {/* Profile Information */}
          <AccordionSection
            id='profile'
            title='Dane osobowe'
            icon={
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                />
              </svg>
            }
            isOpen={openSections.profile ?? true}
            onToggle={toggleSection}
          >
            <div className='space-y-4 pt-4'>
              <div>
                <input
                  type='text'
                  defaultValue='Jan'
                  placeholder='Imię'
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>
              <div>
                <input
                  type='text'
                  defaultValue='Kowalski'
                  placeholder='Nazwisko'
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>
              <div>
                <input
                  type='email'
                  defaultValue='jan.kowalski@example.com'
                  placeholder='Email'
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>
              <div>
                <input
                  type='tel'
                  defaultValue='+48 123 456 789'
                  placeholder='Numer telefonu'
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>
              <button className='bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors'>
                Zapisz zmiany
              </button>
            </div>
          </AccordionSection>

          {/* Address Management */}
          <AccordionSection
            id='addresses'
            title='Adresy'
            icon={
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
            }
            isOpen={openSections.addresses ?? false}
            onToggle={toggleSection}
          >
            <div className='space-y-4 pt-4'>
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className='bg-white rounded-lg border border-gray-200 p-4'
                >
                  <div className='flex justify-between items-start mb-2'>
                    <div>
                      <h4 className='font-medium text-gray-900'>
                        {address.name}
                      </h4>
                      <p className='text-gray-600 text-sm'>{address.street}</p>
                      <p className='text-gray-600 text-sm'>
                        {address.postalCode} {address.city}
                      </p>
                    </div>
                    <button className='text-blue-500 hover:text-blue-600 text-sm'>
                      Edytuj
                    </button>
                  </div>
                </div>
              ))}

              {!showAddressForm ? (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className='w-full border border-gray-300 rounded-lg py-4 text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-colors'
                >
                  + Dodaj nowy adres
                </button>
              ) : (
                <div className='bg-white rounded-lg border border-gray-200 p-6'>
                  <form className='space-y-4' onSubmit={handleSaveAddress}>
                    <div>
                      <input
                        type='text'
                        placeholder='Dom, Praca, Biuro...'
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                      />
                    </div>
                    <div>
                      <input
                        type='text'
                        placeholder='ul. Marszałkowska 123/45'
                        value={formData.street}
                        onChange={(e) =>
                          setFormData({ ...formData, street: e.target.value })
                        }
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                      />
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <input
                          type='text'
                          placeholder='00-123'
                          value={formData.postalCode}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              postalCode: e.target.value,
                            })
                          }
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        />
                      </div>
                      <div>
                        <input
                          type='text'
                          placeholder='Warszawa'
                          value={formData.city}
                          onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        />
                      </div>
                    </div>
                    <div className='flex gap-3 pt-2'>
                      <button
                        type='button'
                        onClick={() => setShowAddressForm(false)}
                        className='flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'
                      >
                        Anuluj
                      </button>
                      <button
                        type='submit'
                        className='flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
                      >
                        Zapisz
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </AccordionSection>

          {/* Account Balance & Top-up */}
          <AccordionSection
            id='balance'
            title='Saldo konta'
            icon={
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
                />
              </svg>
            }
            isOpen={openSections.balance ?? false}
            onToggle={toggleSection}
          >
            <div className='space-y-4 pt-4'>
              <div className='bg-white rounded-lg border border-gray-200 p-6'>
                <div className='text-center'>
                  <p className='text-sm text-gray-600 mb-2'>Aktualne saldo</p>
                  <p className='text-3xl font-bold text-gray-900'>250,00 zł</p>
                </div>
              </div>
              <button className='w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium'>
                Doładuj konto
              </button>
            </div>
          </AccordionSection>
        </div>

        {/* Action Button */}
        <div className='mt-8'>
          <a
            href='/dashboard'
            className='w-full sm:w-1/2 px-6 py-4 border border-gray-200 bg-white text-gray-700 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-all duration-300 text-center flex items-center justify-center'
          >
            <svg
              className='w-5 h-5 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
            Wróć
          </a>
        </div>
      </div>
    </PageLayout>
  )
}
