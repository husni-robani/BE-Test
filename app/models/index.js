const config = require("../config/db");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  // operatorsAliases: false,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/User")(sequelize, Sequelize);
db.survey = require("../models/Survey")(sequelize, Sequelize);

// relation example
db.user.hasMany(db.survey, {
  as: "surveys",
  foreignKey: "userId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

db.survey.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
});

module.exports = db;
