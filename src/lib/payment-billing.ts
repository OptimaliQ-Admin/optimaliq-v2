/**
 * OptimaliQ Payment & Billing Integration
 * Stripe integration, subscription management, and billing automation
 */

// Payment Configuration
const PAYMENT_CONFIG = {
  STRIPE: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || ''
  }
}

// Subscription Plans
export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  stripePriceId: string
  maxUsers?: number
  maxAssessments?: number
  maxStorage?: number
}

// Customer Information
export interface Customer {
  id: string
  email: string
  name: string
  company?: string
  stripeCustomerId?: string
  subscription?: Subscription
  billingAddress?: BillingAddress
  createdAt: Date
  updatedAt: Date
}

// Subscription Information
export interface Subscription {
  id: string
  customerId: string
  planId: string
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  stripeSubscriptionId?: string
  stripePriceId?: string
  quantity: number
  metadata?: Record<string, any>
}

// Billing Address
export interface BillingAddress {
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

// Invoice
export interface Invoice {
  id: string
  customerId: string
  subscriptionId?: string
  amount: number
  currency: string
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void'
  dueDate: Date
  paidAt?: Date
  stripeInvoiceId?: string
  items: InvoiceItem[]
  metadata?: Record<string, any>
}

// Invoice Item
export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
  metadata?: Record<string, any>
}

// Payment Method
export interface PaymentMethod {
  id: string
  customerId: string
  type: 'card' | 'bank_account' | 'sepa_debit'
  last4?: string
  brand?: string
  expMonth?: number
  expYear?: number
  isDefault: boolean
  stripePaymentMethodId?: string
}

// Stripe Integration Service
export class StripeService {
  private publishableKey: string
  private secretKey: string

  constructor() {
    this.publishableKey = PAYMENT_CONFIG.STRIPE.publishableKey
    this.secretKey = PAYMENT_CONFIG.STRIPE.secretKey
  }

  async createCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const response = await fetch('/api/stripe/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(customer)
      })
      return await response.json()
    } catch (error) {
      console.error('Error creating Stripe customer:', error)
      throw error
    }
  }

  async createSubscription(customerId: string, priceId: string, quantity: number = 1) {
    try {
      const response = await fetch('/api/stripe/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerId,
          priceId,
          quantity
        })
      })
      return await response.json()
    } catch (error) {
      console.error('Error creating Stripe subscription:', error)
      throw error
    }
  }

  async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd: boolean = true) {
    try {
      const response = await fetch(`/api/stripe/subscriptions/${subscriptionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cancelAtPeriodEnd
        })
      })
      return await response.json()
    } catch (error) {
      console.error('Error canceling Stripe subscription:', error)
      throw error
    }
  }

  async updateSubscription(subscriptionId: string, updates: {
    priceId?: string
    quantity?: number
    metadata?: Record<string, any>
  }) {
    try {
      const response = await fetch(`/api/stripe/subscriptions/${subscriptionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      })
      return await response.json()
    } catch (error) {
      console.error('Error updating Stripe subscription:', error)
      throw error
    }
  }

  async createPaymentIntent(amount: number, currency: string, customerId: string) {
    try {
      const response = await fetch('/api/stripe/payment-intents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount,
          currency,
          customerId
        })
      })
      return await response.json()
    } catch (error) {
      console.error('Error creating payment intent:', error)
      throw error
    }
  }

  async createInvoice(customerId: string, items: Omit<InvoiceItem, 'id'>[]) {
    try {
      const response = await fetch('/api/stripe/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerId,
          items
        })
      })
      return await response.json()
    } catch (error) {
      console.error('Error creating invoice:', error)
      throw error
    }
  }
}

// Subscription Management Service
export class SubscriptionService {
  private stripeService: StripeService

  constructor() {
    this.stripeService = new StripeService()
  }

  async createSubscription(customer: Customer, plan: SubscriptionPlan) {
    try {
      // Create Stripe customer if not exists
      let stripeCustomerId = customer.stripeCustomerId
      if (!stripeCustomerId) {
        const stripeCustomer = await this.stripeService.createCustomer({
          email: customer.email,
          name: customer.name,
          company: customer.company
        })
        stripeCustomerId = stripeCustomer.id
      }

      // Create subscription
      const subscription = await this.stripeService.createSubscription(
        stripeCustomerId,
        plan.stripePriceId,
        1
      )

      return subscription
    } catch (error) {
      console.error('Error creating subscription:', error)
      throw error
    }
  }

  async upgradeSubscription(subscriptionId: string, newPlan: SubscriptionPlan) {
    try {
      const subscription = await this.stripeService.updateSubscription(subscriptionId, {
        priceId: newPlan.stripePriceId
      })
      return subscription
    } catch (error) {
      console.error('Error upgrading subscription:', error)
      throw error
    }
  }

  async downgradeSubscription(subscriptionId: string, newPlan: SubscriptionPlan) {
    try {
      const subscription = await this.stripeService.updateSubscription(subscriptionId, {
        priceId: newPlan.stripePriceId
      })
      return subscription
    } catch (error) {
      console.error('Error downgrading subscription:', error)
      throw error
    }
  }

  async cancelSubscription(subscriptionId: string) {
    try {
      const subscription = await this.stripeService.cancelSubscription(subscriptionId)
      return subscription
    } catch (error) {
      console.error('Error canceling subscription:', error)
      throw error
    }
  }

  async reactivateSubscription(subscriptionId: string) {
    try {
      const subscription = await this.stripeService.updateSubscription(subscriptionId, {
        cancelAtPeriodEnd: false
      })
      return subscription
    } catch (error) {
      console.error('Error reactivating subscription:', error)
      throw error
    }
  }
}

// Billing Automation Service
export class BillingAutomationService {
  private stripeService: StripeService

  constructor() {
    this.stripeService = new StripeService()
  }

  async generateInvoice(subscription: Subscription, items: Omit<InvoiceItem, 'id'>[]) {
    try {
      const invoice = await this.stripeService.createInvoice(subscription.customerId, items)
      return invoice
    } catch (error) {
      console.error('Error generating invoice:', error)
      throw error
    }
  }

  async processPayment(invoice: Invoice, paymentMethodId: string) {
    try {
      const response = await fetch(`/api/stripe/invoices/${invoice.id}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentMethodId
        })
      })
      return await response.json()
    } catch (error) {
      console.error('Error processing payment:', error)
      throw error
    }
  }

  async sendInvoice(invoice: Invoice) {
    try {
      const response = await fetch(`/api/stripe/invoices/${invoice.id}/send`, {
        method: 'POST'
      })
      return await response.json()
    } catch (error) {
      console.error('Error sending invoice:', error)
      throw error
    }
  }

  async createRefund(paymentIntentId: string, amount?: number, reason?: string) {
    try {
      const response = await fetch('/api/stripe/refunds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentIntentId,
          amount,
          reason
        })
      })
      return await response.json()
    } catch (error) {
      console.error('Error creating refund:', error)
      throw error
    }
  }
}

// Usage Tracking Service
export class UsageTrackingService {
  async trackUsage(customerId: string, metric: string, value: number, timestamp: Date = new Date()) {
    try {
      const response = await fetch('/api/usage/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerId,
          metric,
          value,
          timestamp
        })
      })
      return await response.json()
    } catch (error) {
      console.error('Error tracking usage:', error)
      throw error
    }
  }

  async getUsage(customerId: string, metric: string, startDate: Date, endDate: Date) {
    try {
      const response = await fetch(
        `/api/usage/${customerId}/${metric}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      )
      return await response.json()
    } catch (error) {
      console.error('Error getting usage:', error)
      throw error
    }
  }

  async getCurrentUsage(customerId: string) {
    try {
      const response = await fetch(`/api/usage/${customerId}/current`)
      return await response.json()
    } catch (error) {
      console.error('Error getting current usage:', error)
      throw error
    }
  }
}

// Tax Calculation Service
export class TaxCalculationService {
  async calculateTax(amount: number, country: string, state?: string, postalCode?: string) {
    try {
      const response = await fetch('/api/tax/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount,
          country,
          state,
          postalCode
        })
      })
      return await response.json()
    } catch (error) {
      console.error('Error calculating tax:', error)
      throw error
    }
  }

  async validateTaxId(taxId: string, country: string) {
    try {
      const response = await fetch('/api/tax/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          taxId,
          country
        })
      })
      return await response.json()
    } catch (error) {
      console.error('Error validating tax ID:', error)
      throw error
    }
  }
}

// Financial Reporting Service
export class FinancialReportingService {
  async generateRevenueReport(startDate: Date, endDate: Date, groupBy: 'day' | 'week' | 'month' = 'month') {
    try {
      const response = await fetch('/api/reports/revenue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          groupBy
        })
      })
      return await response.json()
    } catch (error) {
      console.error('Error generating revenue report:', error)
      throw error
    }
  }

  async generateSubscriptionReport(startDate: Date, endDate: Date) {
    try {
      const response = await fetch('/api/reports/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        })
      })
      return await response.json()
    } catch (error) {
      console.error('Error generating subscription report:', error)
      throw error
    }
  }

  async generateChurnReport(startDate: Date, endDate: Date) {
    try {
      const response = await fetch('/api/reports/churn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        })
      })
      return await response.json()
    } catch (error) {
      console.error('Error generating churn report:', error)
      throw error
    }
  }
}

// Export service instances
export const stripeService = new StripeService()
export const subscriptionService = new SubscriptionService()
export const billingAutomationService = new BillingAutomationService()
export const usageTrackingService = new UsageTrackingService()
export const taxCalculationService = new TaxCalculationService()
export const financialReportingService = new FinancialReportingService()

// Default subscription plans
export const DEFAULT_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small teams getting started',
    price: 29,
    currency: 'usd',
    interval: 'month',
    features: [
      'Up to 5 team members',
      'Basic assessments',
      'Email support',
      'Standard reports'
    ],
    stripePriceId: 'price_starter_monthly',
    maxUsers: 5,
    maxAssessments: 10
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Ideal for growing organizations',
    price: 99,
    currency: 'usd',
    interval: 'month',
    features: [
      'Up to 25 team members',
      'Advanced assessments',
      'AI-powered insights',
      'Priority support',
      'Custom reports',
      'API access'
    ],
    stripePriceId: 'price_professional_monthly',
    maxUsers: 25,
    maxAssessments: 100
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations with complex needs',
    price: 299,
    currency: 'usd',
    interval: 'month',
    features: [
      'Unlimited team members',
      'All assessments',
      'Advanced AI features',
      'Dedicated support',
      'Custom integrations',
      'White-label options',
      'Advanced analytics'
    ],
    stripePriceId: 'price_enterprise_monthly',
    maxUsers: -1, // Unlimited
    maxAssessments: -1 // Unlimited
  }
]
