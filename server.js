/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const inventoryRoute = require("./routes/inventoryRoute");
const static = require("./routes/static");
const utilities = require('./utilities');
const baseController = require("./controllers/baseController");
const session = require("express-session");
const flash = require("connect-flash");
const pool = require('./database/');
const bodyParser = require("body-parser");
const { buildManagementView } = require("./controllers/invController");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');

/* ***********************
 * Middleware Setup
 *************************/

// Trust proxy if deployed behind one (e.g., on Render.com)
app.set("trust proxy", 1);

// Session middleware must come first
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,  // Ensure SESSION_SECRET is set in your environment
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}));

// Attach flash middleware after sessions are configured
app.use(flash());

// Debug: Log that req.flash exists
app.use((req, res, next) => {
  console.log("Flash exists?", typeof req.flash); // Should log "function"
  next();
});

// Express Messages Middleware (exposes flash messages to views)
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Parse request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Custom auth check for JWT in cookies
function checkAuth(req, res, next) {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("JWT Error:", err.message);
        res.locals.accountData = null;
      } else {
        res.locals.accountData = decoded;
      }
      next();
    });
  } else {
    res.locals.accountData = null;
    next();
  }
}
app.use(checkAuth);

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/layout"); // not at views root

/* ***********************
 * Routes
 *************************/
app.use(require("./routes/static"));
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));
// Inventory Routes
app.use("/inv", inventoryRoute, buildManagementView);
// Account routes
app.use("/account", require("./routes/accountRoute"));

// IMPORTANT: Mount review routes AFTER session and flash middleware are in place
const reviewRoute = require("./routes/reviewRoute");
app.use("/", reviewRoute);

// Log all route paths (for debugging)
app._router.stack.forEach(function(middleware) {
  if (middleware.route) {
    console.log(middleware.route.path);
  }
});

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
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);

  const status = err.status || 500;
  const message = (status === 404) 
    ? err.message
    : 'Oh no! There was a crash. Maybe try a different route?';

  res.status(status).render("errors/error", {
    title: status,
    message,
    nav
  });
});

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 10000;
const host = process.env.HOST || '0.0.0.0';

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, host, () => {
  console.log(`app listening on ${host}:${port}`);
});