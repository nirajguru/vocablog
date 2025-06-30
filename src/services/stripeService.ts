import { supabase } from '../lib/supabase'

interface CreateCheckoutSessionParams {
  priceId: string
  mode: 'payment' | 'subscription'
  successUrl: string
  cancelUrl: string
}

interface CheckoutSessionResponse {
  sessionId: string
  url: string
}

export async function createCheckoutSession(params: CreateCheckoutSessionParams): Promise<CheckoutSessionResponse> {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.access_token) {
    throw new Error('You must be logged in to make a purchase')
  }

  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      price_id: params.priceId,
      mode: params.mode,
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create checkout session')
  }

  return response.json()
}

export async function getUserSubscription() {
  const { data, error } = await supabase
    .from('stripe_user_subscriptions')
    .select('*')
    .maybeSingle()

  if (error) {
    console.error('Error fetching user subscription:', error)
    return null
  }

  return data
}

export async function getUserOrders() {
  const { data, error } = await supabase
    .from('stripe_user_orders')
    .select('*')
    .order('order_date', { ascending: false })

  if (error) {
    console.error('Error fetching user orders:', error)
    return []
  }

  return data || []
}