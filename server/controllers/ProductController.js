const Product = require("../models/Product");

exports.get = (req, res, next) => {
  return Product.findByID(req.params.id)
    .then((product) => {
      return res.status(200).json({ product });
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};

exports.getAll = (req, res, next) => {
  return Product.findAll()
    .then((products) => {
      return res.status(200).json({ products });
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};

exports.create = (req, res, next) => {
  const product = { ...req.body, image_path: req.files[0].location };

  return Product.createProduct(product)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};

exports.createTable = (req, res, next) => {
  return Product.createTable()
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

  return Product.update(id, product)
    .then((result) => {
      return res.status(200).json({ result });
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};

exports.delete = (req, res, next) => {
  const id = req.params.id;

  return Product.delete(id)
    .then((result) => {
      return res.status(200).json({ result });
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};
