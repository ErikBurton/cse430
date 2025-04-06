// Account routes
const express = require('express')
const router = new express.Router()
const accountController = require('../controllers/accountController')
const utilities = require('../utilities')

router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.get("/signup", utilities.handleErrors(accountController.buildSignup));

module.exports = router;