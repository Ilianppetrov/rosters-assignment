const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/2fa", authController.requestQrCode);

module.exports = router;
