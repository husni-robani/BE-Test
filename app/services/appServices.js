const db = require("../models/index");

exports.fetchAttackApi = async () => {
  try {
    const response = await fetch(
      "https://livethreatmap.radware.com/api/map/attacks?limit=10"
    );
    const data = await response.json();
    console.info("complete calling api");
    return data;
  } catch (error) {
    console.error("Error fetching data from API:", error);
  }
};

exports.saveAttackData = async (allAttacks) => {
  // Save Data to database
  const insertQuery = `
    INSERT INTO "attacks" (sourceCountry, destinationCountry, millisecond, type, weight, attackTime)
    VALUES ($1, $2, $3, $4, $5, $6);
  `;
  try {
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
    console.info("Insert attacks data complete");
  } catch (error) {
    console.error("Error while insert attacks data", error);
  }
};
