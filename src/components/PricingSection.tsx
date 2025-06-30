import React, { useState } from 'react'
import { Check, Loader, Crown } from 'lucide-react'
import { stripeProducts } from '../stripe-config'
import { createCheckoutSession } from '../services/stripeService'

interface PricingSectionProps {
  user: any
  userSubscription?: any
}

export default function PricingSection({ user, userSubscription }: PricingSectionProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')

  const handlePurchase = async (priceId: string, mode: 'payment' | 'subscription') => {
    if (!user) return

    setLoading(priceId)
    setError('')

    try {
      const { url } = await createCheckoutSession({
        priceId,
        mode,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: window.location.href
      })

      if (url) {
        window.location.href = url
      }
    } catch (error: any) {
      setError(error.message || 'Failed to create checkout session')
    } finally {
      setLoading(null)
    }
  }

  const isPremiumUser = userSubscription?.subscription_status === 'active' || 
                       userSubscription?.subscription_status === 'trialing'

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Upgrade to Premium</h2>
        <p className="text-gray-600 text-lg">
          Unlock advanced features to supercharge your vocabulary learning
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      {isPremiumUser && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-2">
            <Crown className="text-yellow-600" size={20} />
            <span className="text-yellow-800 font-medium">You're a Premium user!</span>
          </div>
          <p className="text-yellow-700 text-sm mt-1">
            You have access to all premium features.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <div className="border border-gray-200 rounded-xl p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Free</h3>
            <div className="text-3xl font-bold text-gray-800">£0</div>
            <p className="text-gray-600 text-sm">Forever free</p>
          </div>

          <ul className="space-y-3 mb-6">
            <li className="flex items-center space-x-3">
              <Check className="text-green-500" size={16} />
              <span className="text-gray-700">Look up word definitions</span>
            </li>
            <li className="flex items-center space-x-3">
              <Check className="text-green-500" size={16} />
              <span className="text-gray-700">Save up to 50 words</span>
            </li>
            <li className="flex items-center space-x-3">
              <Check className="text-green-500" size={16} />
              <span className="text-gray-700">Basic flashcard practice</span>
            </li>
            <li className="flex items-center space-x-3">
              <Check className="text-green-500" size={16} />
              <span className="text-gray-700">Synonyms and antonyms</span>
            </li>
          </ul>

          <button
            disabled
            className="w-full bg-gray-100 text-gray-500 py-3 rounded-lg font-medium cursor-not-allowed"
          >
            Current Plan
          </button>
        </div>

        {/* Premium Plan */}
        {stripeProducts.map((product) => (
          <div key={product.id} className="border-2 border-purple-200 rounded-xl p-6 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-purple-600 to-teal-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
              <div className="text-3xl font-bold text-gray-800">{product.price}</div>
              <p className="text-gray-600 text-sm">One-time purchase</p>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center space-x-3">
                <Check className="text-green-500" size={16} />
                <span className="text-gray-700">Everything in Free</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="text-green-500" size={16} />
                <span className="text-gray-700">Unlimited word storage</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="text-green-500" size={16} />
                <span className="text-gray-700">Advanced flashcard modes</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="text-green-500" size={16} />
                <span className="text-gray-700">Progress tracking</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="text-green-500" size={16} />
                <span className="text-gray-700">Export vocabulary lists</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="text-green-500" size={16} />
                <span className="text-gray-700">Priority support</span>
              </li>
            </ul>

            <button
              onClick={() => handlePurchase(product.priceId, product.mode)}
              disabled={loading === product.priceId || isPremiumUser}
              className="w-full bg-gradient-to-r from-purple-600 to-teal-500 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-teal-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
            >
              {loading === product.priceId ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader className="animate-spin" size={18} />
                  <span>Processing...</span>
                </div>
              ) : isPremiumUser ? (
                'Already Purchased'
              ) : (
                'Upgrade Now'
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}