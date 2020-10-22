const Payment = require("../models/Payment");

exports.create = (req, res, next) => {
  const { payment_data, user_id } = req.body;

  return Payment.payWithCard(payment_data, user_id)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};

exports.createTable = (req, res, next) => {
  return Payment.createTable()
    .then((result) => {
      return res.status(200).json({ result });
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};

exports.update = (req, res, next) => {
  const id = req.params.id;
  const product = req.body;

  return Payment.update(id, product)
    .then((result) => {
      return res.status(200).json({ result });
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};

exports.delete = (req, res, next) => {
  const id = req.params.id;

  return Payment.delete(id)
    .then((result) => {
      return res.status(200).json({ result });
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};

exports.get = (req, res, next) => {
  return Payment.findByID(req.params.id)
    .then((product) => {
      return res.status(200).json({ product });
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};

exports.getAll = (req, res, next) => {
  return Payment.findAll()
    .then((products) => {
      return res.status(200).json({ products });
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};
