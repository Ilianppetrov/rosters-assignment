const express = require("express");
const { verifyToken } = require("../middlewares/auth");
const router = express.Router();

const playerController = require("../controllers/player");

router.use(verifyToken);

router.post("/", playerController.createPlayer);
router.delete("/:playerId", playerController.deletePlayer);
router.patch("/:playerId", playerController.updatePlayer);

module.exports = router;
