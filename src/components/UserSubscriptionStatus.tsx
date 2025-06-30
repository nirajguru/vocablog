import React, { useEffect, useState } from 'react'
import { Crown, Package } from 'lucide-react'
import { getUserSubscription, getUserOrders } from '../services/stripeService'

interface UserSubscriptionStatusProps {
  user: any
}

export default function UserSubscriptionStatus({ user }: UserSubscriptionStatusProps) {
  const [subscription, setSubscription] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user])

  const fetchUserData = async () => {
    try {
      const [subscriptionData, ordersData] = await Promise.all([
        getUserSubscription(),
        getUserOrders()
      ])
      
      setSubscription(subscriptionData)
      setOrders(ordersData)
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-10 w-10"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  const isPremiumUser = subscription?.subscription_status === 'active' || 
                       subscription?.subscription_status === 'trialing' ||
                       orders.some(order => order.payment_status === 'paid')

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-center space-x-3">
        {isPremiumUser ? (
          <>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-full">
              <Crown className="text-white" size={20} />
            </div>
            <div>
              <p className="font-medium text-gray-800">Premium User</p>
              <p className="text-sm text-gray-600">All features unlocked</p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-gray-100 p-2 rounded-full">
              <Package className="text-gray-600" size={20} />
            </div>
            <div>
              <p className="font-medium text-gray-800">Free User</p>
              <p className="text-sm text-gray-600">Limited features</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}