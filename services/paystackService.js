const axios                     = require("axios");
const crypto                    = require("crypto");
const {paystackClient}            = require('../config/paystackClient');
const { generateReference }     = require("../utils/paystackUtils");



//Initialize a payment request with Paystack
async function initializePayment(amount, email, callbackUrl) {
  try {
    const reference = generateReference();

    const response = await paystackClient.post("/transaction/initialize", {
      email,
      amount,
      reference,
      callback_url: callbackUrl
    });

    return response.data;
  } catch (error) {
    console.error("Paystack Init Error:", error.response?.data || error.message);
    throw new Error("Payment initialization failed");
  }
}


/**
 * Verify a payment with Paystack
 */
async function verifyPayment(reference) {
  try {
    const response = await paystackClient.get(`/transaction/verify/${reference}`);
    return response.data;
  } catch (error) {
    console.error("Paystack Verify Error:", error.response?.data || error.message);
    throw new Error("Payment verification failed");
  }
}

module.exports = { initializePayment, verifyPayment };