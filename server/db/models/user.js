module.exports = (sequelize, DataTypes) =>
  sequelize.define("user", {
    email: {
      type: DataTypes.STRING,
      primaryKey: true,
      isEmail: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    auth_secret: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
