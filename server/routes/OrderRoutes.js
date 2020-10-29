let router = require("express").Router();
let orderController = require("../controllers/OrderController");

router.get("/:user_id/all", orderController.getAllFromUser);
router.get("/:user_id/:id", orderController.get);
router.post("/", orderController.create);
router.post("/create", orderController.createTable);

module.exports = router;
