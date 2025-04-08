const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to deliver the management view
router.get("/", invController.buildManagementView);

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

router.get("/detail/:vehicleId", invController.buildInventoryDetail);


module.exports = router;
