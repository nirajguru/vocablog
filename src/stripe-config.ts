export interface StripeProduct {
  id: string
  priceId: string
  name: string
  description: string
  mode: 'payment' | 'subscription'
  price: string
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_Sb1MzhaTax4Qyj',
    priceId: 'price_1RfpJUB1RF635Q02uw6EhMUy',
    name: 'VocabLog Premium',
    description: 'Unlock premium features for your vocabulary learning journey',
    mode: 'payment',
    price: '£2.99'
  }
]

export const getProductById = (id: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.id === id)
}

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId)
}