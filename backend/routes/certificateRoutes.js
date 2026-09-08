const router = require("express").Router();
const verifyToken = require("../middleware/auth");
const { excelUpload, imageUpload } = require("../middleware/upload");
const controller = require("../controllers/certificateController");
router.get("/verify/:certificateid", controller.verifyById);
router.post(
  "/verify/verify-image",
  imageUpload.single("certificate"),
  controller.verifyImage,
);
router.post("/add", verifyToken, controller.addCertificate);
router.post(
  "/upload",
  verifyToken,
  excelUpload.single("excelFile"),
  controller.uploadExcel,
);
module.exports = router;
