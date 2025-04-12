const pool = require("../database/");

async function addReview(account_id, rating, comment) {
  try {
    const sql = `
      INSERT INTO review (account_id, rating, comment)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await pool.query(sql, [account_id, rating, comment]);
    return result.rows[0];
  } catch (error) {
    console.error("addReview error:", error.message);
    throw error;
  }
}

async function getAllReviews() {
  try {
    const sql = `SELECT * FROM review ORDER BY created_at DESC;`;
    const result = await pool.query(sql);
    return result.rows;
  } catch (error) {
    console.error("getAllReviews error:", error.message);
    throw error;
  }
}

async function getAverageRating() {
  try {
    const sql = `
      SELECT AVG(rating)::numeric(3,1) AS average, COUNT(*) AS total_reviews
      FROM review;
    `;
    const result = await pool.query(sql);
    return result.rows[0];
  } catch (error) {
    console.error("getAverageRating error:", error.message);
    throw error;
  }
}

module.exports = { addReview, getAllReviews, getAverageRating };
