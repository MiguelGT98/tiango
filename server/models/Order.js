const stripe = require("stripe")(process.env.TEST_STRIPE_PRIVATE_KEY);

var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://dynamodb:8000",
});
