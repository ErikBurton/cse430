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
const static = require("./routes/static")
const utilities = require('./utilities');

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)

// Index route
app.get("/", function (req, res) {
  res.render("index", {title: "Home",
 })
})

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: "Sorry, we appear to have lost that page."})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
// server.js (or your main file)
app.use((err, req, res, next) => {
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message
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
