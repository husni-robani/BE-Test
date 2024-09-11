const User = require("./User");

module.exports = (sequelize, Sequelize) => {
  const Survey = sequelize.define(
    "Survey",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      values: {
        type: Sequelize.ARRAY(Sequelize.INTEGER), // Sequelize supports PostgreSQL arrays
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: User,
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
    },
    {
      tableName: "surveys",
      timestamps: true,
    }
  );
  return Survey;
};
