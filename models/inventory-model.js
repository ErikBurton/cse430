const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getVehicleById(vehicle_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
       WHERE i.inv_id =$1`,
       [vehicle_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("error " + error)
  }
}

async function addClassification(classificationName) {
  try {
    const result = await pool.query(
      `INSERT INTO public.classification (classification_name)
       VALUES ($1)
       RETURNING *`,
       [classificationName]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error adding classification: " + error);
    return null;
  }
}

// Add Inventory Function
async function addInventory(data) {
  try {
    const query = `
      INSERT INTO public.inventory (
        inv_make, inv_model, inv_year, inv_description, inv_image,
        inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`;
      
    const params = [
      data.inv_make,
      data.inv_model,
      data.inv_year,
      data.inv_description,
      data.inv_image,
      data.inv_thumbnail,
      data.inv_price,
      data.inv_miles,
      data.inv_color,
      data.classification_id
    ];
    const result = await pool.query(query, params);
    return result.rows[0];
  } catch (error) {
    console.error("Error adding inventory: " + error);
    return null;
  }
}

module.exports = { 
  getClassifications, 
  getInventoryByClassificationId, 
  getVehicleById,
  addClassification,
  addInventory  
};

module.exports = { getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, addInventory };