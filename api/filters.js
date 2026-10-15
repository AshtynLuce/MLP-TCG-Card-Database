const { pool, TABLE } = require("../lib/db");

module.exports = async (_req, res) => {
  try {
    const tiers = await pool.query(`SELECT DISTINCT tier FROM ${TABLE} ORDER BY tier`);
    const sets = await pool.query(`SELECT DISTINCT set_name FROM ${TABLE} ORDER BY set_name`);
    res.json({ tiers: tiers.rows.map(r => r.tier), sets: sets.rows.map(r => r.set_name) });
  } catch (e) { console.error(e); res.status(500).json({ error: "db error" }); }
};
