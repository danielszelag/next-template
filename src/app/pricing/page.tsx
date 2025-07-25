'use client'
import { useState } from 'react'
import PageLayout from '@/components/page-layout'
import PricingCard from '@/components/pricing-card'

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState('Standard')

  const plans = [
    {
      id: 'Podstawowy',
      title: 'Podstawowy',
      price: 120,
      description: 'Idealne dla małych mieszkań',
      features: [
        'Sprzątanie podstawowe',
        'Do 50m²',
        'Raz w tygodniu',
        'Podstawowe środki czystości',
      ],
      buttonText: 'Wybierz plan',
    },
    {
      id: 'Standard',
      title: 'Standard',
      price: 200,
      description: 'Najlepszy wybór dla większości domów',
      features: [
        'Sprzątanie dokładne',
        'Do 100m²',
        '2 razy w tygodniu',
        'Profesjonalne środki',
        'Pranie okien (raz w miesiącu)',
      ],
      buttonText: 'Umów wizytę',
      badge: 'Najpopularniejszy',
    },
    {
      id: 'Premium',
      title: 'Premium',
      price: 350,
      description: 'Kompleksowa obsługa dla wymagających',
      features: [
        'Wszystko ze Standard',
        'Bez limitu powierzchni',
        'Codzienne sprzątanie',
        'Pranie i prasowanie',
        'Organizacja przestrzeni',
        'Wsparcie 24/7',
      ],
      buttonText: 'Skontaktuj się',
    },
  ]
  return (
    <PageLayout>
      <div className='space-y-16'>
        <div className='text-center'>
          <h1 className='text-4xl md:text-6xl font-light text-gray-900 mb-6'>
            Przejrzyste Cenniki Sprzątania
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Wybierz plan sprzątania idealny dla Twojego domu. Profesjonalne
            usługi dostosowane do Twoich potrzeb.
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto md:items-stretch'>
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              title={plan.title}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              isSelected={selectedPlan === plan.id}
              buttonText={plan.buttonText}
              buttonStyle={selectedPlan === plan.id ? 'primary' : 'default'}
              badge={plan.badge}
              onClick={() => setSelectedPlan(plan.id)}
            />
          ))}
        </div>

        <div className='text-center'>
          <p className='text-gray-600 mb-8'>
            Aktualnie wybrany:{' '}
            <span className='font-semibold text-gray-900'>{selectedPlan}</span>{' '}
            plan
          </p>
        </div>

        <div className='text-center'>
          <h2 className='text-2xl font-light text-gray-900 mb-4'>
            Często Zadawane Pytania
          </h2>
          <div className='max-w-3xl mx-auto space-y-6'>
            <div className='text-left'>
              <h3 className='font-medium text-gray-900 mb-2'>
                Czy mogę zmienić plan w każdej chwili?
              </h3>
              <p className='text-gray-600'>
                Tak, możesz zmienić plan sprzątania w każdej chwili. Zmiany
                wchodzą w życie od następnej wizyty.
              </p>
            </div>
            <div className='text-left'>
              <h3 className='font-medium text-gray-900 mb-2'>
                Czy oferujecie bezpłatną wizytę próbną?
              </h3>
              <p className='text-gray-600'>
                Tak, oferujemy bezpłatną wizytę próbną dla wszystkich nowych
                klientów. Bez zobowiązań i ukrytych kosztów.
              </p>
            </div>
            <div className='text-left'>
              <h3 className='font-medium text-gray-900 mb-2'>
                Jakie formy płatności akceptujecie?
              </h3>
              <p className='text-gray-600'>
                Akceptujemy gotówkę, przelewy bankowe, karty płatnicze oraz
                płatności przez BLIK. Płatność możliwa po każdej wizycie lub
                miesięcznie.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
