const User = require("../models/User");

exports.get = (req, res, next) => {
  return User.findByID(req.params.id)
    .then((user) => {
      return res.status(200).json({ user });
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};

exports.getAll = (req, res, next) => {
  return User.findAll()
    .then((users) => {
      return res.status(200).json({ users });
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};

exports.register = (req, res, next) => {
  const user = req.body;

  return User.createUser(user)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};

exports.createTable = (req, res, next) => {
  return User.createTable()
    .then((result) => {
      return res.status(200).json({ result });
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
};
