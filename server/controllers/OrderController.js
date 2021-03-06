const Payment = require("../models/Payment");
const User = require("../models/User");
const Order = require("../models/Order");

exports.create = (req, res, next) => {
  const { user_id, products, payment_method } = req.body;

  const payment_data = {
    amount: products.reduce((acc, product) => {
      return acc + typeof product.price === "number"
        ? product.price
        : parseFloat(product.price) * product.quantity;
    }, 0),
    payment_method,
    description: "Test order",
  };

  return Payment.payWithCard(payment_data, user_id)
    .then(({ payment }) => {
      const order = {
        products,
        payment_id: payment.id,
        amount: payment.amount,
        description: payment.description,
        date_created: new Date().toISOString(),
        status: "pending",
        user_id,
      };

      return Order.createOrder(order);
    })
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};

exports.createWithPoints = (req, res, next) => {
  const { user_id, products } = req.body;

  const payment_data = {
    amount: products.reduce((acc, product) => {
      return acc + typeof product.price === "number"
        ? product.price
        : parseFloat(product.price) * product.quantity;
    }, 0),
    description: "Test order",
  };

  return User.findByID(user_id)
    .then((user) => {
      if (user.points < payment_data.amount) {
        throw { message: "User does not have enough points." };
      }

      return User.update(user_id, {
        points: user.points - payment_data.amount,
      });
    })
    .then(() => {
      const order = {
        products,
        amount: payment_data.amount * 100,
        date_created: new Date().toISOString(),
        status: "accepted",
        user_id,
      };

      return Order.createOrder(order);
    })
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};

exports.createTable = (req, res, next) => {
  return Order.createTable()
    .then((result) => {
      return res.status(200).json({ result });
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};

exports.getAllFromUser = (req, res, next) => {
  return Order.findAll(req.params.user_id)
    .then((orders) => {
      return res.status(200).json({ orders });
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};

exports.get = (req, res, next) => {
  return Order.findByID(req.params.user_id, req.params.id)
    .then((order) => {
      return res.status(200).json({ order });
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};
