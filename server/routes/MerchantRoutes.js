let router = require("express").Router();
let merchantController = require("../controllers/MerchantController");

const { upload } = require("../models/Multer");

router.post("/createTable", merchantController.createTable);
router.get("/:location_id/all", merchantController.getAll);
router.get("/:id", merchantController.get);
router.delete("/:id", merchantController.delete);
router.patch("/:id", upload.array("image", 1), merchantController.update);
router.post("/", upload.array("image", 1), merchantController.create);

module.exports = router;
