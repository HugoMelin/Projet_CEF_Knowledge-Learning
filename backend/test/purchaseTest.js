/* eslint-disable no-undef */
const assert = require('assert');
// eslint-disable-next-line import/no-extraneous-dependencies
const sinon = require('sinon');
const StripeService = require('../services/stripeService');

describe('StripeService', () => {
  let stripeService;
  let mockStripe;

  beforeEach(() => {
    mockStripe = {
      checkout: {
        sessions: {
          create: sinon.stub(),
          retrieve: sinon.stub(),
        },
      },
      products: {
        retrieve: sinon.stub(),
      },
    };
    stripeService = new StripeService();
    stripeService.stripe = mockStripe;
  });

  describe('createCheckoutSession', () => {
    it('should create a checkout session successfully', async () => {
      const items = [
        {
          name: 'Item 1', type: 'course', id: '1', price: 10, quantity: 1,
        },
      ];
      const successUrl = 'http://example.com/success';
      const cancelUrl = 'http://example.com/cancel';
      const userId = '123';

      const expectedSession = { id: 'sess_123', url: 'http://example.com/checkout' };
      mockStripe.checkout.sessions.create.resolves(expectedSession);

      const session = await stripeService
        .createCheckoutSession(items, successUrl, cancelUrl, userId);

      assert.deepStrictEqual(session, expectedSession);
      sinon.assert.calledOnce(mockStripe.checkout.sessions.create);
      sinon.assert.calledWith(mockStripe.checkout.sessions.create, sinon.match({
        payment_method_types: ['card'],
        line_items: sinon.match.array,
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        client_reference_id: userId,
      }));
    });

    it('should throw an error if session creation fails', async () => {
      mockStripe.checkout.sessions.create.rejects(new Error('Stripe error'));

      await assert.rejects(
        stripeService.createCheckoutSession([], '', '', ''),
        { message: 'Stripe error' },
      );
    });
  });

  describe('getSessionDetails', () => {
    it('should retrieve session details successfully', async () => {
      const sessionId = 'sess_123';
      const expectedDetails = { id: sessionId, status: 'complete' };
      mockStripe.checkout.sessions.retrieve.resolves(expectedDetails);

      const details = await stripeService.getSessionDetails(sessionId);

      assert.deepStrictEqual(details, expectedDetails);
      sinon.assert.calledOnce(mockStripe.checkout.sessions.retrieve);
      sinon.assert.calledWith(mockStripe.checkout.sessions.retrieve, sessionId, {
        expand: ['line_items', 'customer'],
      });
    });

    it('should throw an error if session retrieval fails', async () => {
      mockStripe.checkout.sessions.retrieve.rejects(new Error('Stripe error'));

      await assert.rejects(
        stripeService.getSessionDetails('sess_123'),
        { message: 'Stripe error' },
      );
    });
  });

  describe('getProductDetails', () => {
    it('should retrieve product details successfully', async () => {
      const productId = 'prod_123';
      const expectedDetails = { id: productId, name: 'Test Product' };
      mockStripe.products.retrieve.resolves(expectedDetails);

      const details = await stripeService.getProductDetails(productId);

      assert.deepStrictEqual(details, expectedDetails);
      sinon.assert.calledOnce(mockStripe.products.retrieve);
      sinon.assert.calledWith(mockStripe.products.retrieve, productId);
    });

    it('should throw an error if product retrieval fails', async () => {
      mockStripe.products.retrieve.rejects(new Error('Stripe error'));

      await assert.rejects(
        stripeService.getProductDetails('prod_123'),
        { message: 'Stripe error' },
      );
    });
  });
});
