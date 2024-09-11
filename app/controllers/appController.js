const db = require("../models/index");
const Survey = db.survey;
const User = db.user;

exports.refactoreMe1 = async (req, res) => {
  try {
    const [data] = await db.sequelize.query(`select * from "surveys"`);

    return res.status(200).send({
      statusCode: 200,
      success: true,
      data,
    });
  } catch (err) {
    return res.status(500).send({
      statusCode: 500,
      success: false,
      message: "Error while querying surveys",
      error: err.message,
    });
  }
};

exports.refactoreMe2 = async (req, res) => {
  const { values, userId } = req.body;

  if (!values || !userId) {
    return res.status(400).send({
      statusCode: 400,
      success: false,
      message: "values and userId is required",
    });
  }

  try {
    const [[newSurvey]] = await db.sequelize.query(
      `INSERT INTO "surveys" ("values", "userId", "createdAt", "updatedAt") 
         VALUES (ARRAY[${values.join(",")}], ${userId}, now(), now()) 
         RETURNING *`
    );

    if (!newSurvey) {
      return res.status(500).send({
        statusCode: 500,
        success: false,
        message: "Survey not created",
      });
    }

    // await user.update({ dosurvey: true });
    await db.sequelize.query(
      `UPDATE "users" 
      SET "dosurvey" = ${true} 
      WHERE id = ${userId}
      RETURNING *`
    );

    return res.status(201).json({
      statusCode: 201,
      success: true,
      data: newSurvey,
    });
  } catch (err) {
    console.log("Error while creating new surveys");

    return res.status(500).send({
      statusCode: 500,
      success: false,
      message: "Error while creating survey",
      error: err.message,
    });
  }
};
