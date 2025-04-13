const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const { body } = require("express-validator")
const { checkAccountType } = require("../middleware/authorize")

// Route to deliver the management view
router.get("/", invController.buildManagementView);

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:vehicleId", invController.buildInventoryDetail);

// GET route to display the add-classification form
router.get("/add-classification", invController.buildAddClassificationView);

// POST route to process the new classification submission
router.post("/add-classification",
  // Server-side validation middleware: enforce no spaces or special characters
  body("classificationName")
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage("Classification name must contain only letters and numbers, with no spaces or special characters."),
  invController.addNewClassification
);

// New routes for Task Three: Add Inventory
router.get("/add-inventory", invController.buildAddInventoryView);
router.post("/add-inventory",
  // Server-side validations for inventory fields:
  body("inv_make").notEmpty().withMessage("Vehicle make is required."),
  body("inv_model").notEmpty().withMessage("Vehicle model is required."),
  body("inv_year").isInt({ min: 1886 }).withMessage("Enter a valid model year."), 
  body("inv_description").notEmpty().withMessage("Description is required."),
  body("inv_price").isFloat({ min: 0 }).withMessage("Price must be a positive number."),
  body("inv_miles").isInt({ min: 0 }).withMessage("Mileage must be a positive number."),
  body("inv_color").notEmpty().withMessage("Color is required."),
  body("classification_id").notEmpty().withMessage("A classification must be selected."),
  invController.addNewInventory
);

router.get("/management", checkAccountType, invController.buildManagementView)


module.exports = router;
