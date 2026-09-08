const router = require("express").Router();
const { signin } = require("../controllers/authController");
router.post("/signin", signin);
module.exports = router;
