const stripe = require("stripe")(process.env.TEST_STRIPE_PRIVATE_KEY);

var AWS = require("aws-sdk");

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION
  
});
