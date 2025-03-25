// Account routes
const express = require('express')
const router = new express.Router()
const inventoryController = require('../controllers/accountController')
const utilities = require('../utitilites')

router.get("/login", utilities.handleErrors(accountController.buildLogin))