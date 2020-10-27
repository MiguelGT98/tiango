const PaymentMethod = require("../models/PaymentMethod");
const User = require("../models/User");

exports.getAll = (req, res, next) => {
  const { user_id } = req.query;

  return PaymentMethod.findAll(user_id)
    .then((methods) => {
      return res.status(200).json({ methods });
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};

exports.create = (req, res, next) => {
  const { payment_method_id, user_id } = req.body;

  return PaymentMethod.addPaymentMethod(payment_method_id, user_id)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};
