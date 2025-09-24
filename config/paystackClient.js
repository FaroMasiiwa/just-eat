const axios = require("axios");

// Axios instance for Paystack
const paystackClient = axios.create({
  baseURL: "https://api.paystack.co",
  timeout: 5000,
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

module.exports = {
  paystackClient,
};
