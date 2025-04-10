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
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)

router.get("/update/:account_id", accountController.showUpdateForm)

// Update basic account info
router.post(
  "/update",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  accountController.updateAccount
);

// Update password
router.post(
  "/update-password",
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  accountController.updatePassword
);

router.get("/logout", accountController.logout);

module.exports = router;