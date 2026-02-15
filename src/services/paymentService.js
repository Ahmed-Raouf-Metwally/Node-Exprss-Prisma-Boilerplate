const Stripe = require('stripe');
const logger = require('../utils/logger');

/**
 * Payment Service using Stripe
 * Handles all payment-related operations
 */
class PaymentService {
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  /**
   * Create Payment Intent
   * @param {Number} amount - Amount in cents
   * @param {String} currency - Currency code (e.g., 'usd')
   * @param {Object} metadata - Additional metadata
   */
  async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount), // Ensure integer
        currency,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      logger.info(`Payment Intent created: ${paymentIntent.id}`);
      return paymentIntent;
    } catch (error) {
      logger.error('Error creating payment intent:', error);
      throw error;
    }
  }

  /**
   * Create Customer
   * @param {Object} customerData - Customer information
   */
  async createCustomer(customerData) {
    try {
      const customer = await this.stripe.customers.create({
        email: customerData.email,
        name: customerData.name,
        metadata: customerData.metadata || {},
      });

      logger.info(`Customer created: ${customer.id}`);
      return customer;
    } catch (error) {
      logger.error('Error creating customer:', error);
      throw error;
    }
  }

  /**
   * Retrieve Payment Intent
   * @param {String} paymentIntentId - Payment Intent ID
   */
  async retrievePaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      logger.error('Error retrieving payment intent:', error);
      throw error;
    }
  }

  /**
   * Create Refund
   * @param {String} paymentIntentId - Payment Intent ID
   * @param {Number} amount - Amount to refund (optional, full refund if not specified)
   */
  async createRefund(paymentIntentId, amount = null) {
    try {
      const refundData = { payment_intent: paymentIntentId };
      if (amount) {
        refundData.amount = Math.round(amount);
      }

      const refund = await this.stripe.refunds.create(refundData);
      logger.info(`Refund created: ${refund.id}`);
      return refund;
    } catch (error) {
      logger.error('Error creating refund:', error);
      throw error;
    }
  }

  /**
   * Verify Webhook Signature
   * @param {String} payload - Request body
   * @param {String} signature - Stripe signature header
   */
  verifyWebhookSignature(payload, signature) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      return event;
    } catch (error) {
      logger.error('Webhook signature verification failed:', error);
      throw error;
    }
  }

  /**
   * Create Checkout Session
   * @param {Object} sessionData - Session configuration
   */
  async createCheckoutSession(sessionData) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: sessionData.lineItems,
        mode: sessionData.mode || 'payment',
        success_url: sessionData.successUrl,
        cancel_url: sessionData.cancelUrl,
        customer_email: sessionData.customerEmail,
        metadata: sessionData.metadata || {},
      });

      logger.info(`Checkout session created: ${session.id}`);
      return session;
    } catch (error) {
      logger.error('Error creating checkout session:', error);
      throw error;
    }
  }
}

module.exports = new PaymentService();
