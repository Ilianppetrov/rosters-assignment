const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");

const userModel = require("../models/user");
const teamModel = require("../models/team");
const playerModel = require("../models/player");

dotenv.config();

const sequelize = new Sequelize({
  username: process.env.PGUSER,
  password: String(process.env.PGPASSWORD),
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  dialect: "postgres",
});

const User = userModel(sequelize, DataTypes);
const Team = teamModel(sequelize, DataTypes);
const Player = playerModel(sequelize, DataTypes);

User.hasMany(Team, { as: "teams" });
Team.hasMany(Player, { as: "players", onDelete: "cascade" });

sequelize.sync({ force: true });
