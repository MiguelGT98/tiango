let router = require("express").Router();
let userController = require("../controllers/UserController");

router.post("/create", userController.createTable);
router.get("/all", userController.getAll);
router.get("/:id", userController.get);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/verify", userController.verify);
router.post("/code", userController.resendCode);
router.post("/addPoints", userController.addPoints);

module.exports = router;
