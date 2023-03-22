const db = require("../db");

const getAll = async (req, res) => {
  try {
    const { email } = req.user;

    const teams = await db.teams.findAll({
      where: {
        userEmail: email,
      },
    });
    res.status(200).send({
      teams,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const createTeam = async (req, res) => {
  try {
    const { name } = req.body;

    const alreadyCreatedTeam = await db.teams.findOne({
      where: {
        name,
      },
    });

    if (alreadyCreatedTeam) {
      res.status(400).send({
        message: "Team with that name already exists",
      });
      return;
    }

    await db.teams.create({
      name,
      userEmail: req.user.email,
    });

    res.status(201).send({});
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const { teamId } = req.params;

    await db.teams.destroy({
      where: {
        id: teamId,
      },
    });

    res.status(200).send({
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getDetails = async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await db.teams.findOne({
      where: {
        id: teamId,
      },
    });

    if (!team) {
      res.status(404).send({
        message: "Team does not exist",
      });
      return;
    }

    const players = await db.players.findAll({
      where: {
        teamId,
      },
    });

    res.status(200).send({
      team,
      players,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getAll,
  createTeam,
  deleteTeam,
  getDetails,
};
