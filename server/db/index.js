const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");

const userModel = require("./models/user");
const teamModel = require("./models/team");
const playerModel = require("./models/player");

dotenv.config();

const sequelize = new Sequelize({
  username: process.env.PGUSER,
  password: String(process.env.PGPASSWORD),
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  dialect: "postgres",
});

sequelize
  .authenticate()
  .then(() => {
    console.log(`Database connected`);
  })
  .catch((err) => {
    console.log(err);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = userModel(sequelize, DataTypes);
db.teams = teamModel(sequelize, DataTypes);
db.players = playerModel(sequelize, DataTypes);

db.users.hasMany(db.teams, { as: "teams" });
db.teams.hasMany(db.players, { as: "players", onDelete: "cascade" });

module.exports = db;
