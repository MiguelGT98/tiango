let router = require("express").Router();
let paymentMethodController = require("../controllers/PaymentMethodController");

router.post("/create", paymentMethodController.create);
router.post("/", paymentMethodController.add);
router.get("/", paymentMethodController.getAll);

module.exports = router;
