const pool = require('../database') // or wherever your DB connection is

async function getClassifications() {
  const sql = 'SELECT * FROM classification ORDER BY classification_name'
  return pool.query(sql)
}

async function getInventoryByClassificationId(classificationId) {
  const sql = `
    SELECT i.*, c.classification_name
    FROM inventory AS i
    JOIN classification AS c 
      ON i.classification_id = c.classification_id
    WHERE i.classification_id = $1
    ORDER BY i.inv_make, i.inv_model
  `
  return pool.query(sql, [classificationId])
}

async function getInventoryById(inv_id) {
  const sql = `
    SELECT i.*, c.classification_name
    FROM inventory AS i
    JOIN classification AS c
      ON i.classification_id = c.classification_id
    WHERE i.inv_id = $1
  `
  return pool.query(sql, [inv_id])
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById
}
