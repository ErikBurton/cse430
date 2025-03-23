// controllers/inventoryController.js
const inventoryModel = require('../models/inventory-model')
const utilities = require('../utilities')

async function buildByClassification(req, res, next) {
  try {
    const classificationId = parseInt(req.params.classificationId)
    const data = await inventoryModel.getInventoryByClassificationId(classificationId)
    
    if (data.rowCount > 0) {
      // If the first row has classification_name, you can use that as the page title
      const classificationName = data.rows[0].classification_name
      return res.render('inventory/classification', {
        title: classificationName,
        nav: await utilities.getNav(),
        vehicles: data.rows
      })
    } else {
      // If no data, handle it gracefully
      return res.status(404).send('No vehicles found for this classification')
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  buildByClassification,
  // ... other functions like buildDetail, etc.
}
