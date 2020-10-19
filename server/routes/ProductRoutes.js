let router = require("express").Router();
let productController = require("../controllers/ProductController");

router.post("/create", productController.createTable);
router.get("/all", productController.getAll);
router.get("/:id", productController.get);
router.post("/", productController.create);
router.patch("/:id", productController.update);
router.delete("/:id", productController.delete);

module.exports = router;
