const pool = require("../database/")

/* *****************************
*   Signup new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
  }

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      `SELECT account_id, firstname, lastname, email, account_type 
       FROM account 
       WHERE account_id = $1`,
      [account_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("getAccountById error:", error.message);
    throw error;
  }
}

async function updateAccountInfo(firstname, lastname, email, account_id) {
  try {
    const sql = `
      UPDATE account
      SET firstname = $1, lastname = $2, email = $3
      WHERE account_id = $4
      RETURNING *;
    `;
    const result = await pool.query(sql, [firstname, lastname, email, account_id]);
    return result.rowCount; // 1 if successful
  } catch (error) {
    console.error("updateAccountInfo error:", error.message);
    throw error;
  }
}

async function updatePassword(hashedPassword, account_id) {
  try {
    const sql = `
      UPDATE account
      SET password = $1
      WHERE account_id = $2
      RETURNING *;
    `;
    const result = await pool.query(sql, [hashedPassword, account_id]);
    return result.rowCount; // 1 if successful
  } catch (error) {
    console.error("updatePassword error:", error.message);
    throw error;
  }
}

async function getAccountByEmail(email) {
  try {
    const result = await pool.query(
      `SELECT * FROM account WHERE account_email = $1`,
      [email]
    );
    return result.rows[0];
  } catch (error) {
    console.error("getAccountByEmail error:", error.message);
    throw new Error("Database query failed");
  }
}

module.exports = { registerAccount, checkExistingEmail , getAccountById, updateAccountInfo, updatePassword, getAccountByEmail};