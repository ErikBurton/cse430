// Account routes
const express = require('express')
const router = new express.Router()
const regValidate = require('../utilities/account-validation')
const accountController = require('../controllers/accountController')
const utilities = require('../utilities')

router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

module.exports = router;