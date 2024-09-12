const db = require("../models/index");
const Survey = db.survey;
const User = db.user;
const Service = require("../services/appServices");

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

// WebSocket-based endpoint to fetch data every 3 minutes
exports.callmeWebSocket = (ws, req) => {
  // const allAttacks = data.flat();
  const fetchAndSend = async () => {
    const data = await Service.fetchAttackApi();

    // Send data to the WebSocket client
    if (ws.readyState === ws.OPEN) {
      // Check if websocket is still open
      ws.send(JSON.stringify(data));
      console.log("Sent data to WebSocket client");
    }
  };

  // interval for fetching every 3 menutes (180000)
  const intervalId = setInterval(fetchAndSend, 180000);

  ws.on("message", function (msg) {
    console.log("received message", msg);
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
    clearInterval(intervalId);
  });
};

exports.getData = async (req, res) => {
  // Delete all data first
  await db.sequelize.query(`DELETE FROM "attacks"`);

  // Insert new data
  const data = await Service.fetchAttackApi();
  const allAttacks = data.flat();
  await Service.saveAttackData(allAttacks);

  try {
    // Raw query to count attacks by destinationCountry
    const destinationQuery = `
      SELECT destinationCountry AS country, COUNT(*) AS total
      FROM "attacks"
      GROUP BY destinationCountry;
    `;

    // Raw query to count attacks by sourceCountry
    const sourceQuery = `
      SELECT sourceCountry AS country, COUNT(*) AS total
      FROM "attacks"
      GROUP BY sourceCountry;
    `;

    const [destinationResult] = await db.sequelize.query(destinationQuery);
    const [sourceResult] = await db.sequelize.query(sourceQuery);
    const labels = [];
    const totals = [];

    destinationResult.forEach((row) => {
      labels.push(row.country.trim());
      totals.push(parseInt(row.total));
    });

    res.json({
      success: true,
      statusCode: 200,
      data: {
        label: labels,
        total: totals,
      },
    });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
};
