const Merchant = require("../models/Merchant");

exports.createTable = (req, res, next) => {
  return Merchant.createTable()
    .then((result) => {
      return res.status(200).json({ result });
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};

exports.getAll = (req, res, next) => {
  return Merchant.findAll(req.params.location_id)
    .then((merchants) => {
      return res.status(200).json({ merchants });
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};

exports.get = (req, res, next) => {
  return Merchant.findByID(req.params.id)
    .then((merchant) => {
      return res.status(200).json({ merchant });
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};

exports.create = (req, res, next) => {
  const merchant = { ...req.body, image_path: req.files[0].location };

  return Merchant.create(merchant)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};

exports.delete = (req, res, next) => {
  const id = req.params.id;

  return Merchant.delete(id)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};

exports.update = (req, res, next) => {
  let merchant;
  if (req.files.length === 0) {
    merchant = { ...req.body };
  } else {
    merchant = { ...req.body, image_path: req.files[0].location };
  }

  return Merchant.update(req.params.id, merchant)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};
