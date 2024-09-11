const { Sequelize } = require("sequelize");
Sequelize.BOOLEAN;

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      digits: {
        type: Sequelize.STRING(155),
        unique: true,
      },
      fotoUrl: {
        type: Sequelize.STRING(255),
      },
      workType: {
        type: Sequelize.STRING(100),
      },
      positionTitle: {
        type: Sequelize.STRING(100),
      },
      lat: {
        type: Sequelize.FLOAT,
      },
      lon: {
        type: Sequelize.FLOAT,
      },
      company: {
        type: Sequelize.STRING(155),
      },
      isLogin: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      dovote: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      dosurvey: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      dofeedback: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      fullname: {
        type: Sequelize.STRING(255),
      },
      cuurentLeave: {
        type: Sequelize.INTEGER,
      },
    },
    {
      tableName: "users",
      timestamps: false,
    }
  );
  return User;
};
