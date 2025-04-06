/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/

const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const static = require("./routes/static")
const utilities = require('./utilities');
const baseController = require("./controllers/baseController");
const session = require("express-session");
const pool = require('./database/')

/* ***********************
 * Middleware
 * ************************/
// Express-session
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})
 
/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(require("./routes/static"))
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))
// Inventory Routes
app.use("/inv", inventoryRoute)
// Account routes
app.use("/account", require("./routes/accountRoute"))

// Route to simulate a 500 error
app.get('/error500', async (req, res, next) => {
  try {
    let nav = await utilities.getNav(); 
    const err = new Error("Intentional Server Error for testing");
    err.status = 500;
    next(err);
  } catch (e) {
    next(e); 
  }
});
// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: "Sorry, we appear to have lost that page."})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
// server.js (or your main file)
app.use(async(err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  const status = err.status || 500;
  const message = (status === 404) 
    ? err.message
    : 'Oh no! There was a crash. Maybe try a different route?'

  res.status(status).render("errors/error", {
    title: status,
    message,
    nav
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 10000;
const host = process.env.HOST || '0.0.0.0';

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, host, () => {
  console.log(`app listening on ${host}:${port}`)
})
