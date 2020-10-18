let router = require("express").Router();
let userController = require("../controllers/UserController");

router.post("/create", userController.createTable);
router.get("/all", userController.getAll);
router.get("/:id", userController.get);
router.post("/", userController.register);

module.exports = router;
