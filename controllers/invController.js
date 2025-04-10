const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const { validationResult } = require("express-validator");

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    errors: null,
    grid,
  })
}

invCont.buildInventoryDetail = async function (req, res, next) {
  const vehicleId = req.params.vehicleId
  const data = await invModel.getVehicleById(vehicleId)
  let nav = await utilities.getNav()
  res.render("./inventory/detail", {
    title: data.inv_year + " " + data.inv_make + " " + data.inv_model,
    nav,
    vehicle: data
   })
}

invCont.buildManagementView = async function (req, res) {
  let nav = await utilities.getNav();

  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    flash: req.flash("message"),
    errors: null
  });
}

// Build and Render "Add Classification" View
invCont.buildAddClassificationView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      flash: req.flash("message"),
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

// Process New Classification Submission
invCont.addNewClassification = async function (req, res, next) {
  const { classificationName } = req.body;
  const errors = validationResult(req);
  let nav = await utilities.getNav();

  // Check for server-side validation errors
  if (!errors.isEmpty()) {
    // Render the same view with errors displayed
    return res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: errors,
      flash: req.flash("message")
    });
  }
  
   // Attempt to add the new classification using the model function
   const result = await invModel.addClassification(classificationName);
   if (result) {
     // Success: set a flash message, update navigation, and redirect to management view
     req.flash("message", "The new classification was added successfully.");
     // Redirect to the management view (which should now include updated navigation)
     return res.redirect("/inv/");
   } else {
     // Failure: flash error message and re-render the form
     req.flash("message", "Failed to add classification. Please try again.");
     return res.render("inventory/add-classification", {
       title: "Add New Classification",
       nav,
       errors: errors,
       flash: req.flash("message")
     });
   }
 };

 // Build and Render the Add Inventory View (GET)
invCont.buildAddInventoryView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    // Build the classification dropdown (no pre-selected value for first load)
    let classificationList = await utilities.buildClassificationList();
    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      flash: req.flash("message"),
      errors: null,
      // Provide empty/default sticky values for the form fields:
      inv_make: "",
      inv_model: "",
      inv_year: "",
      inv_description: "",
      inv_image: "/images/vehicles/no-image-available.png",
      inv_thumbnail: "/images/vehicles/no-image-available.png",
      inv_price: "",
      inv_miles: "",
      inv_color: "",
      classification_id: ""
    });
  } catch (error) {
    next(error);
  }
};

// Process the Add Inventory Form Submission (POST)
invCont.addNewInventory = async function (req, res, next) {
  const { inv_make, inv_model, inv_year, inv_description, inv_image,
          inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;
  const errors = validationResult(req);
  let nav = await utilities.getNav();
  // Rebuild the classification list with the submitted classification_id as the selected option:
  let classificationList = await utilities.buildClassificationList(classification_id);

  // If validation errors exist, re-render the view with sticky form values:
  if (!errors.isEmpty()) {
    return res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      flash: req.flash("message"),
      errors: errors,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    });
  }

  // Prepare the data object for insertion
  const inventoryData = {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  };

  // Insert the new vehicle into the inventory table using the model function
  const result = await invModel.addInventory(inventoryData);

  if (result) {
    // On success, set a flash message and redirect to the management view
    req.flash("message", "The new vehicle was added successfully.");
    return res.redirect("/inv/");
  } else {
    // On failure, set an error message and re-render the view
    req.flash("message", "Failed to add vehicle. Please try again.");
    return res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      flash: req.flash("message"),
      errors: errors,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    });
  }
};
 
module.exports = invCont;
