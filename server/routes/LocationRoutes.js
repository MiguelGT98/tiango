let router = require("express").Router();
let locationController = require("../controllers/LocationController");

const { upload } = require("../models/Multer");

router.get("/all", locationController.getAll);
router.get("/:id", locationController.get);
router.delete("/:id", locationController.delete);
router.patch("/:id", upload.array("image", 1), locationController.update);
router.post("/", upload.array("image", 1), locationController.create);

module.exports = router;
