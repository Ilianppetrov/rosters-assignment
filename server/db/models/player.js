module.exports = (sequelize, DataTypes) =>
  sequelize.define("player", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isInjured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
