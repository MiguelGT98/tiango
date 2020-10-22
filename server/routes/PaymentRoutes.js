let router = require("express").Router();
let paymentController = require("../controllers/PaymentController");

router.get("/all", paymentController.getAll);
router.get("/:id", paymentController.get);
router.post("/", paymentController.create);
router.patch("/:id", paymentController.update);
router.delete("/:id", paymentController.delete);
router.post("/create", paymentController.createTable);

module.exports = router;
