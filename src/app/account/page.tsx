'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import PageLayout from '@/components/page-layout'
import type {
  Address,
  CreateAddressRequest,
  UserProfile,
  CreateProfileRequest,
} from '@/types/api'

const AccordionSection = ({
  id,
  title,
  icon,
  children,
  rightContent,
  //   defaultOpen = false,
  isOpen,
  onToggle,
}: {
  id: string
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  rightContent?: React.ReactNode
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
        <div className='flex items-center space-x-3'>
          {rightContent}
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
        </div>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className='px-6 py-6 bg-gray-50 border-t border-gray-200'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default function AccountPage() {
  const { user, isLoaded } = useUser()
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    profile: true,
  })
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [formData, setFormData] = useState<CreateAddressRequest>({
    name: '',
    street: '',
    postalCode: '',
    city: '',
  })
  const [editFormData, setEditFormData] = useState<CreateAddressRequest>({
    name: '',
    street: '',
    postalCode: '',
    city: '',
  })
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [showTransactionHistory, setShowTransactionHistory] = useState(false)
  const [profileFormData, setProfileFormData] = useState<CreateProfileRequest>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    language: 'pl',
  })
  const [addressNameError, setAddressNameError] = useState('')
  const [editAddressNameError, setEditAddressNameError] = useState('')

  // Helper function to validate address name length
  const validateAddressName = (name: string): string => {
    if (name.length > 16) {
      return 'Nazwa adresu nie może być dłuższa niż 16 znaków'
    }
    return ''
  }

  // Mock transaction data
  const mockTransactions = [
    {
      id: '1',
      date: '2025-01-15',
      type: 'doładowanie',
      amount: 500.0,
      description: 'Doładowanie konta kartą',
      status: 'zakończona',
    },
    {
      id: '2',
      date: '2025-01-10',
      type: 'płatność',
      amount: -120.0,
      description: 'Sprzątanie mieszkania - ul. Warszawska 15',
      status: 'zakończona',
    },
    {
      id: '3',
      date: '2025-01-08',
      type: 'doładowanie',
      amount: 300.0,
      description: 'Doładowanie konta BLIK',
      status: 'zakończona',
    },
    {
      id: '4',
      date: '2025-01-05',
      type: 'płatność',
      amount: -85.0,
      description: 'Sprzątanie biura - ul. Marszałkowska 100',
      status: 'zakończona',
    },
    {
      id: '5',
      date: '2025-01-03',
      type: 'zwrot',
      amount: 45.0,
      description: 'Zwrot za anulowane sprzątanie',
      status: 'zakończona',
    },
  ]

  // Fetch addresses from API
  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/addresses')
      if (response.ok) {
        const data = (await response.json()) as Address[]
        setAddresses(data)
      } else {
        console.error('Failed to fetch addresses')
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    } finally {
      setLoading(false)
    }
  }

  // Autofill profile form with data from Clerk OAuth
  const autofillFromClerkData = useCallback(() => {
    if (user && isLoaded) {
      const firstName = user.firstName || ''
      const lastName = user.lastName || ''
      const email = user.emailAddresses?.[0]?.emailAddress || ''

      setProfileFormData({
        firstName,
        lastName,
        email,
        phone: '',
        language: 'pl',
      })
    }
  }, [user, isLoaded])

  // Fetch user profile from API
  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = (await response.json()) as UserProfile
        if (data) {
          setUserProfile(data)
          setProfileFormData({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone || '',
            language: data.language,
          })
        } else {
          // No profile in database, autofill from Clerk OAuth data
          autofillFromClerkData()
        }
      } else {
        // No profile found, autofill from Clerk OAuth data
        autofillFromClerkData()
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      // On error, still try to autofill from Clerk data
      autofillFromClerkData()
    } finally {
      setLoadingProfile(false)
    }
  }, [autofillFromClerkData])

  // Create or update user profile
  const saveProfile = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileFormData),
      })

      if (response.ok) {
        const savedProfile = (await response.json()) as UserProfile
        setUserProfile(savedProfile)
        setIsEditingProfile(false)
        console.log('Profile saved successfully')
      } else {
        console.error('Failed to save profile')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    }
  }

  // Create new address
  const createAddress = async (addressData: CreateAddressRequest) => {
    try {
      const response = await fetch('/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      })

      if (response.ok) {
        const newAddress = (await response.json()) as Address
        setAddresses([newAddress, ...addresses])
        setFormData({ name: '', street: '', postalCode: '', city: '' })
        setAddressNameError('') // Clear validation error
        setShowAddressForm(false)
      } else {
        console.error('Failed to create address')
      }
    } catch (error) {
      console.error('Error creating address:', error)
    }
  }

  // Update existing address
  const updateAddress = async (
    addressId: string,
    addressData: CreateAddressRequest
  ) => {
    try {
      const response = await fetch('/api/addresses', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: addressId, ...addressData }),
      })

      if (response.ok) {
        const updatedAddress = (await response.json()) as Address
        setAddresses(
          addresses.map((addr) =>
            addr.id === addressId ? updatedAddress : addr
          )
        )
        setEditFormData({ name: '', street: '', postalCode: '', city: '' })
        setEditAddressNameError('') // Clear validation error
        setEditingAddressId(null)
      } else {
        console.error('Failed to update address')
      }
    } catch (error) {
      console.error('Error updating address:', error)
    }
  }

  // Delete existing address
  const deleteAddress = async (addressId: string) => {
    try {
      const response = await fetch('/api/addresses', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: addressId }),
      })

      if (response.ok) {
        setAddresses(addresses.filter((addr) => addr.id !== addressId))
        // If we're editing this address, clear the editing state
        if (editingAddressId === addressId) {
          setEditingAddressId(null)
          setEditFormData({ name: '', street: '', postalCode: '', city: '' })
        }
      } else {
        console.error('Failed to delete address')
      }
    } catch (error) {
      console.error('Error deleting address:', error)
    }
  }

  // Load addresses and profile on component mount
  useEffect(() => {
    fetchAddresses()
    if (isLoaded) {
      fetchProfile()
    }
  }, [isLoaded, fetchProfile])

  // Check URL parameters to auto-open specific sections
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const section = urlParams.get('section')
    if (section === 'addresses') {
      setOpenSections((prev) => ({
        ...prev,
        addresses: true,
        profile: false, // Close profile section to focus on addresses
      }))
    }
  }, [])

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate address name length
    const nameError = validateAddressName(formData.name)
    setAddressNameError(nameError)

    if (nameError) {
      return // Don't submit if there's a validation error
    }

    if (
      formData.name &&
      formData.street &&
      formData.postalCode &&
      formData.city
    ) {
      await createAddress(formData)
      setAddressNameError('') // Clear error on successful save
    }
  }

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const handleDeleteConfirm = () => {
    if (addressToDelete) {
      deleteAddress(addressToDelete.id)
      setShowDeleteModal(false)
      setAddressToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setAddressToDelete(null)
  }

  return (
    <PageLayout>
      <div className='bg-green-50/20 min-h-screen -mx-6 px-6'>
        <div className='max-w-4xl mx-auto pt-8'>
          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div
              className='fixed inset-0 z-50 flex items-center justify-center p-4'
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
              onClick={handleDeleteCancel}
            >
              <div
                className='bg-white rounded-lg shadow-lg max-w-md w-full p-6'
                onClick={(e) => e.stopPropagation()}
              >
                <div className='mb-4'>
                  <p className='text-gray-600 text-center font-bold'>
                    Czy chcesz usunąć ten adres?
                  </p>
                </div>
                <div className='flex space-x-3'>
                  <button
                    onClick={handleDeleteCancel}
                    className='flex-1 bg-white text-black py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-bold'
                  >
                    Wróć
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className='flex-1 bg-white text-red-500 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-bold'
                  >
                    Usuń
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className='space-y-4'>
            {/* Account Balance & Top-up */}
            <AccordionSection
              id='balance'
              title='Saldo'
              icon={
                <svg
                  className='w-6 h-6 text-green-500'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  strokeWidth={2}
                >
                  <circle cx='12' cy='12' r='10' />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
                  />
                </svg>
              }
              rightContent={
                <span className='text-xl font-bold text-gray-900 px-3 border border-gray-300 rounded-lg bg-gray-50 min-w-[120px] text-center'>
                  1250,00 zł
                </span>
              }
              isOpen={openSections.balance ?? false}
              onToggle={toggleSection}
            >
              <div className='space-y-4'>
                <button className='w-full bg-black text-white py-2 rounded-lg border border-gray-300 hover:bg-gray-800 transition-colors font-bold'>
                  Doładuj konto
                </button>
                <button className='w-full bg-white text-black py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-bold'>
                  Wypłać z konta
                </button>
                <button
                  onClick={() =>
                    setShowTransactionHistory(!showTransactionHistory)
                  }
                  className='w-full bg-white text-black py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-bold'
                >
                  Historia transakcji
                </button>

                {/* Transaction History */}
                {showTransactionHistory && (
                  <div className='mt-4 bg-white rounded-lg border border-gray-200 p-4'>
                    <div className='space-y-3 max-h-80 overflow-y-auto'>
                      {mockTransactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className='flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg'
                        >
                          <div className='flex-1'>
                            <div className='flex items-center gap-2 mb-1'>
                              <span
                                className={`text-sm font-medium px-2 py-1 rounded-full ${
                                  transaction.type === 'doładowanie'
                                    ? 'bg-green-100 text-green-800'
                                    : transaction.type === 'płatność'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {transaction.type === 'doładowanie'
                                  ? 'Doładowanie'
                                  : transaction.type === 'płatność'
                                  ? 'Płatność'
                                  : 'Zwrot'}
                              </span>
                              <span className='text-xs text-gray-500'>
                                {transaction.date}
                              </span>
                            </div>
                            <p className='text-sm text-gray-700'>
                              {transaction.description}
                            </p>
                          </div>
                          <div className='text-right ml-4'>
                            <span
                              className={`text-lg font-bold ${
                                transaction.amount > 0
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {transaction.amount > 0 ? '+' : ''}
                              {transaction.amount.toFixed(2)} zł
                            </span>
                            <p className='text-xs text-gray-500 mt-1'>
                              {transaction.status}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {mockTransactions.length === 0 && (
                      <div className='text-center py-8 text-gray-500'>
                        <p>Brak transakcji do wyświetlenia</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </AccordionSection>

            {/* Profile Information */}
            <AccordionSection
              id='profile'
              title='Dane osobowe'
              icon={
                <svg
                  className='w-6 h-6 text-blue-400'
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
              <div className='space-y-4'>
                {loadingProfile ? (
                  <div className='flex justify-center py-8'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500'></div>
                  </div>
                ) : (
                  <>
                    {!userProfile &&
                      (user?.emailAddresses?.[0]?.emailAddress ||
                        user?.firstName ||
                        user?.lastName) && (
                        <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4'>
                          <div className='flex items-center text-blue-800 text-sm'>
                            <svg
                              className='w-4 h-4 mr-2'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                            >
                              <path
                                fillRule='evenodd'
                                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                                clipRule='evenodd'
                              />
                            </svg>
                            Dane zostały automatycznie uzupełnione z konta
                            Google
                          </div>
                        </div>
                      )}

                    {!isEditingProfile ? (
                      // Display mode
                      <div className='space-y-4'>
                        <div className='px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-800 min-h-[42px] flex items-center'>
                          {profileFormData.firstName || 'Imię'}
                        </div>
                        <div className='px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-800 min-h-[42px] flex items-center'>
                          {profileFormData.lastName || 'Nazwisko'}
                        </div>
                        <div className='px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-800 min-h-[42px] flex items-center'>
                          {profileFormData.email || 'Email'}
                        </div>
                        <div className='px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-800 min-h-[42px] flex items-center'>
                          {profileFormData.phone || 'Numer telefonu'}
                        </div>
                        <button
                          onClick={() => setIsEditingProfile(true)}
                          className='w-full bg-black text-white py-2 rounded-lg border border-gray-300 hover:bg-gray-800 transition-colors font-bold'
                        >
                          Edytuj
                        </button>
                      </div>
                    ) : (
                      // Editing mode
                      <div className='space-y-4'>
                        <input
                          type='text'
                          value={profileFormData.firstName}
                          onChange={(e) =>
                            setProfileFormData((prev) => ({
                              ...prev,
                              firstName: e.target.value,
                            }))
                          }
                          placeholder='Imię'
                          className='w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-h-[42px]'
                        />
                        <input
                          type='text'
                          value={profileFormData.lastName}
                          onChange={(e) =>
                            setProfileFormData((prev) => ({
                              ...prev,
                              lastName: e.target.value,
                            }))
                          }
                          placeholder='Nazwisko'
                          className='w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-h-[42px]'
                        />
                        <input
                          type='email'
                          value={profileFormData.email}
                          onChange={(e) =>
                            setProfileFormData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          placeholder='Email'
                          className='w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-h-[42px]'
                        />
                        <input
                          type='tel'
                          value={profileFormData.phone}
                          onChange={(e) =>
                            setProfileFormData((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          placeholder='Numer telefonu'
                          className='w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-h-[42px]'
                        />
                        <div className='flex space-x-3'>
                          <button
                            onClick={() => {
                              // Reset form to original profile data and exit editing mode
                              if (userProfile) {
                                setProfileFormData({
                                  firstName: userProfile.firstName,
                                  lastName: userProfile.lastName,
                                  email: userProfile.email,
                                  phone: userProfile.phone || '',
                                  language: userProfile.language,
                                })
                              }
                              setIsEditingProfile(false)
                            }}
                            className='bg-white flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-bold'
                          >
                            Anuluj
                          </button>
                          <button
                            onClick={saveProfile}
                            className='flex-1 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors font-bold'
                          >
                            Zapisz
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </AccordionSection>

            {/* Address Management */}
            <AccordionSection
              id='addresses'
              title='Adresy'
              icon={
                <svg
                  className='w-6 h-6 text-red-500'
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
              <div className='space-y-4'>
                {loading ? (
                  <div className='flex justify-center py-8'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500'></div>
                  </div>
                ) : showAddressForm ? (
                  <form className='space-y-4' onSubmit={handleSaveAddress}>
                    <input
                      type='text'
                      placeholder='Dom, Praca, Biuro...'
                      value={formData.name}
                      onChange={(e) => {
                        const newValue = e.target.value
                        setFormData({ ...formData, name: newValue })
                        const error = validateAddressName(newValue)
                        setAddressNameError(error)
                      }}
                      className={`bg-white w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        addressNameError ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {addressNameError && (
                      <p className='text-red-500 text-sm mt-1'>
                        {addressNameError}
                      </p>
                    )}

                    <input
                      type='text'
                      placeholder='ul. Marszałkowska 123/45'
                      value={formData.street}
                      onChange={(e) =>
                        setFormData({ ...formData, street: e.target.value })
                      }
                      className='bg-white w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                    />
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
                      className='bg-white w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                    />
                    <input
                      type='text'
                      placeholder='Warszawa'
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className='bg-white w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                    />

                    <div className='flex space-x-3'>
                      <button
                        onClick={() => setShowAddressForm(false)}
                        type='button'
                        className='bg-white flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-bold'
                      >
                        Anuluj
                      </button>
                      <button
                        type='submit'
                        className='flex-1 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors font-bold'
                      >
                        Zapisz
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className='space-y-4'>
                    {addresses.length > 0 &&
                      addresses.map((address) => (
                        <div
                          key={address.id}
                          className='bg-white rounded-lg border border-gray-200 p-3'
                        >
                          {editingAddressId === address.id ? (
                            <div className='space-y-3'>
                              <input
                                type='text'
                                value={editFormData.name}
                                onChange={(e) => {
                                  const newValue = e.target.value
                                  setEditFormData((prev) => ({
                                    ...prev,
                                    name: newValue,
                                  }))
                                  const error = validateAddressName(newValue)
                                  setEditAddressNameError(error)
                                }}
                                placeholder='Dom, Praca, Biuro...'
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                  editAddressNameError
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                                }`}
                              />
                              {editAddressNameError && (
                                <p className='text-red-500 text-sm mt-1'>
                                  {editAddressNameError}
                                </p>
                              )}
                              <input
                                type='text'
                                value={editFormData.street}
                                onChange={(e) =>
                                  setEditFormData((prev) => ({
                                    ...prev,
                                    street: e.target.value,
                                  }))
                                }
                                placeholder='Ulica i numer'
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                              />
                              <div className='grid grid-cols-2 gap-3'>
                                <input
                                  type='text'
                                  value={editFormData.postalCode}
                                  onChange={(e) =>
                                    setEditFormData((prev) => ({
                                      ...prev,
                                      postalCode: e.target.value,
                                    }))
                                  }
                                  placeholder='Kod pocztowy'
                                  className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                                />
                                <input
                                  type='text'
                                  value={editFormData.city}
                                  onChange={(e) =>
                                    setEditFormData((prev) => ({
                                      ...prev,
                                      city: e.target.value,
                                    }))
                                  }
                                  placeholder='Miasto'
                                  className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                                />
                              </div>
                              <div className='flex space-x-3'>
                                <button
                                  onClick={() => {
                                    setEditingAddressId(null)
                                    setEditFormData({
                                      name: '',
                                      street: '',
                                      postalCode: '',
                                      city: '',
                                    })
                                  }}
                                  type='button'
                                  className='flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-bold'
                                >
                                  Anuluj
                                </button>
                                <button
                                  onClick={async () => {
                                    const nameError = validateAddressName(
                                      editFormData.name
                                    )
                                    setEditAddressNameError(nameError)

                                    if (nameError) {
                                      return // Don't submit if there's a validation error
                                    }

                                    await updateAddress(
                                      address.id,
                                      editFormData
                                    )
                                    setEditAddressNameError('') // Clear error on successful save
                                  }}
                                  type='button'
                                  className='flex-1 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors font-bold'
                                >
                                  Zapisz
                                </button>
                              </div>
                            </div>
                          ) : (
                            // Display mode
                            <div className='flex justify-between items-center gap-3'>
                              <div className='flex flex-col sm:flex-row sm:items-center sm:gap-4 flex-1 min-w-0'>
                                <h4 className='text-gray-900 text-lg font-bold'>
                                  {address.name}
                                </h4>
                                <p className='text-gray-900 text-sm'>
                                  {address.street}
                                </p>
                                <p className='text-gray-600 text-sm'>
                                  {address.postalCode} {address.city}
                                </p>
                              </div>
                              <div className='flex flex-col space-y-4 flex-shrink-0'>
                                <button
                                  onClick={() => {
                                    setAddressToDelete(address)
                                    setShowDeleteModal(true)
                                  }}
                                  className='text-red-500 hover:text-red-600 text-sm font-bold'
                                >
                                  Usuń
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingAddressId(address.id)
                                    setEditFormData({
                                      name: address.name,
                                      street: address.street,
                                      postalCode: address.postalCode,
                                      city: address.city,
                                    })
                                  }}
                                  className='text-emerald-500 hover:text-emerald-600 text-sm font-bold'
                                >
                                  Edytuj
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                    {addresses.length === 0 && (
                      <div className='text-center py-2 text-gray-500'>
                        <p>Brak zapisanych adresów</p>
                      </div>
                    )}

                    <button
                      onClick={() => setShowAddressForm(true)}
                      className='w-full bg-black text-white py-2 rounded-lg border border-gray-300 hover:bg-gray-800 transition-colors font-bold'
                    >
                      Dodaj
                    </button>
                  </div>
                )}
              </div>
            </AccordionSection>
          </div>

          {/* Action Button */}
          <div className='mt-4'>
            <a
              href='/dashboard'
              className='w-full sm:w-1/2 px-6 py-3 border border-gray-200 bg-white text-gray-700 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-all duration-300 text-center flex items-center justify-center'
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
      </div>
    </PageLayout>
  )
}
