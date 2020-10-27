let router = require("express").Router();
let productController = require("../controllers/ProductController");

const { upload } = require("../models/Multer");

router.post("/create", productController.createTable);
router.get("/all", productController.getAll);
router.get("/:id", productController.get);
router.post("/", upload.array("image", 1), productController.create);
router.patch("/:id", productController.update);
router.delete("/:id", productController.delete);

module.exports = router;
