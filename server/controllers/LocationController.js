const Location = require("../models/Location");

exports.getAll = (req, res, next) => {
  return Location.findAll()
    .then((locations) => {
      return res.status(200).json({ locations });
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};

exports.get = (req, res, next) => {
  return Location.findByID(req.params.id)
    .then((location) => {
      return res.status(200).json({ location });
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};

exports.create = (req, res, next) => {
  const location = { ...req.body, image_path: req.files[0].location };

  return Location.create(location)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};

exports.delete = (req, res, next) => {
  const id = req.params.id;

  return Location.delete(id)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};

exports.update = (req, res, next) => {
  let location;
  if (req.files.length === 0) {
    location = { ...req.body };
  } else {
    location = { ...req.body, image_path: req.files[0].location };
  }

  return Location.update(req.params.id, location)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};
