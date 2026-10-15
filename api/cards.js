const { pool, TABLE } = require("../lib/db");

const SORTS = {
  id: "card_id ASC",
  name: "card_name ASC, card_id ASC",
  rarity: "CASE tier WHEN 'C' THEN 1 WHEN 'CR' THEN 2 WHEN 'RR' THEN 3 WHEN 'GR' THEN 4 WHEN 'SPR' THEN 5 ELSE 6 END, card_id ASC",
};

module.exports = async (req, res) => {
  try {
    const { q = "", tier = "", set = "", sort = "id" } = req.query;
    const limit = Math.min(parseInt(req.query.limit) || 24, 100);
    const page = Math.max(parseInt(req.query.page) || 1, 1);

    const where = [], params = [];
    if (q)    { params.push(`%${q}%`); where.push(`(card_name ILIKE $${params.length} OR card_id ILIKE $${params.length})`); }
    if (tier) { params.push(tier);     where.push(`tier = $${params.length}`); }
    if (set)  { params.push(set);      where.push(`set_name = $${params.length}`); }
    const w = where.length ? "WHERE " + where.join(" AND ") : "";

    const total = await pool.query(`SELECT COUNT(*)::int AS n FROM ${TABLE} ${w}`, params);
    const rows = await pool.query(
      `SELECT card_id, card_name, tier, set_name, image_link FROM ${TABLE} ${w}
       ORDER BY ${SORTS[sort] || SORTS.id} LIMIT ${limit} OFFSET ${(page - 1) * limit}`,
      params
    );
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
    res.json({ total: total.rows[0].n, page, pages: Math.max(Math.ceil(total.rows[0].n / limit), 1), cards: rows.rows });
  } catch (e) { console.error(e); res.status(500).json({ error: "db error" }); }
};
