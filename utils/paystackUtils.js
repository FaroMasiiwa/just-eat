const crypto = require("crypto");

//Generate a unique transaction reference.

function generateReference(prefix = "JUST-EAT") {
  return `${prefix}_${crypto.randomUUID()}`;
}

module.exports = { generateReference };
