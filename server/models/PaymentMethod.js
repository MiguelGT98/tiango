const stripe = require("stripe")(
  process.env.TEST_STRIPE_PRIVATE_KEY
);

var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://dynamodb:8000",
});

const User = require("./User");

exports.findAll = (stripe_id) => {
  return stripe.paymentMethods
    .list({
      customer: stripe_id,
      type: "card",
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

exports.addPaymentMethod = (payment_method_id, user_id) => {
  return User.findByID(user_id)
    .then((user) => {
      if (user.stripe_id) {
        return associatePaymentMethodToUser(payment_method_id, user.stripe_id);
      }

      return createStripeUser(user).then((newUser) => {
        return associatePaymentMethodToUser(
          payment_method_id,
          newUser.Attributes.stripe_id
        );
      });
    })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw error;
    });
};

const createStripeUser = (user) => {
  const { username, phone, id } = user;

  return stripe.customers
    .create({
      phone,
      name: username,
      description: "User from Tiango",
    })
    .then((response) => {
      return User.update(id, { stripe_id: response.id });
    })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw error;
    });
};

const associatePaymentMethodToUser = (payment_method_id, customer_id) => {
  return stripe.paymentMethods
    .attach(payment_method_id, {
      customer: customer_id,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};
