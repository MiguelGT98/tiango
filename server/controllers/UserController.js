const Cognito = require("../models/Cognito");
const User = require("../models/User");

exports.get = (req, res, next) => {
  return User.findByID(req.params.id)
    .then((user) => {
      return res.status(200).json({ user });
    })
    .catch((error) => {
      return res.status(error.statusCode || 401).json({ error });
    });
};

exports.getAll = (req, res, next) => {
  return User.findAll()
    .then((users) => {
      return res.status(200).json({ users });
    })
    .catch((error) => {
      return res.status(error.statusCode || 401).json({ error });
    });
};

exports.register = (req, res, next) => {
  const user = req.body;

  return User.register(user)
    .then((result) => {
      return User.createUser({
        id: result.uid,
        username: result.username,
        phone: user.phone,
        verified: false,
        date_created: new Date().toISOString(),
      });
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      return res.status(error.statusCode || 401).json({ error });
    });
};

exports.verify = (req, res, next) => {
  const { user, code } = req.body;

  return User.confirmCode(user, code)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      return res.status(error.statusCode || 401).json({ error });
    });
};

exports.login = (req, res, next) => {
  const user = req.body;

  return User.login(user)
    .then((result) => {
      const { uid } = result;

      return User.findByID(uid);
    })
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      return res.status(error.statusCode || 401).json({ error });
    });
};

exports.createTable = (req, res, next) => {
  return User.createTable()
    .then((result) => {
      return res.status(200).json({ result });
    })
    .catch((error) => {
      return res.status(error.statusCode || 401).json({ error });
    });
};

exports.resendCode = (req, res, next) => {
  return User.findByID(req.body.user.id)
    .then((user) => {
      return Cognito.resendVerificationCode(user.username);
    })
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      return res.status(error.statusCode || 401).json({ error });
    });
};
