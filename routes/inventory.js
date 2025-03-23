// routes/inventory.js
const express = require('express')
const router = express.Router()
const inventoryController = require('../controllers/inventoryController')

// Route to show vehicles by classification
router.get('/type/:classificationId', inventoryController.buildByClassification)

module.exports = router
