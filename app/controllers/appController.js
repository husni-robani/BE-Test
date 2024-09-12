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

// WebSocket-based endpoint to fetch data every 3 minutes
exports.callmeWebSocket = (ws, req) => {
  const fetchApiData = async () => {
    try {
      const response = await fetch(
        "https://livethreatmap.radware.com/api/map/attacks?limit=10"
      );
      const data = await response.json();

      const allAttacks = data.flat();

      // Send data to the WebSocket client
      if (ws.readyState === ws.OPEN) {
        // Check if websocket is still open
        ws.send(JSON.stringify(data));
        console.log("Sent data to WebSocket client");
      }

      // Save Data to database
      const insertQuery = `
      INSERT INTO "Attacks" (sourceCountry, destinationCountry, millisecond, type, weight, attackTime)
      VALUES ($1, $2, $3, $4, $5, $6);
    `;
      if (allAttacks) {
        console.log("Saved Data");
        for (const attack of allAttacks) {
          const {
            sourceCountry,
            destinationCountry,
            millisecond,
            type,
            weight,
            attackTime,
          } = attack;

          await db.sequelize.query(insertQuery, {
            bind: [
              sourceCountry || "Unknown",
              destinationCountry || "Unknown",
              millisecond,
              type,
              weight,
              new Date(attackTime),
            ],
          });
        }
      }
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  // interval for fetching every 3 menutes (180000)
  const intervalId = setInterval(fetchApiData, 180000);

  ws.on("message", function (msg) {
    console.log("received message", msg);
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
    clearInterval(intervalId);
  });
};

exports.getData = (req, res) => {
  // do something
};
