let router = require("express").Router();
let paymentMethodController = require("../controllers/PaymentMethodController");

router.post("/", paymentMethodController.create);
router.get("/", paymentMethodController.getAll);

module.exports = router;
