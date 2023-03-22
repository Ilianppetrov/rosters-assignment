const db = require("../db");

const createPlayer = async (req, res) => {
  try {
    const { name, isInjured, teamId } = req.body;

    await db.players.create({
      name,
      teamId,
      isInjured,
    });

    res.status(200).send({
      message: "Created",
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const deletePlayer = async (req, res) => {
  try {
    const { playerId } = req.params;

    await db.players.destroy({
      where: {
        id: playerId,
      },
    });

    res.status(200).send({
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const updatePlayer = async (req, res) => {
  try {
    const { playerId } = req.params;
    const { isInjured } = req.body;

    await db.players.update(
      { isInjured },
      {
        where: {
          id: playerId,
        },
      }
    );

    res.status(200).send({
      message: "Updated successfully",
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  createPlayer,
  deletePlayer,
  updatePlayer,
};
