const express = require("express");
const { verifyToken } = require("../middlewares/auth");
const router = express.Router();

const teamController = require("../controllers/team");

router.use(verifyToken);

router.get("/", teamController.getAll);
router.post("/create", teamController.createTeam);
router.delete("/:teamId", teamController.deleteTeam);
router.get("/:teamId", teamController.getDetails);

module.exports = router;
