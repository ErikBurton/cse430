const utilities = require('../utilities')
/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    try {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
    });
  } catch (err) {
    console.error("Error in buildLogin", err)
    next(err);
  }
}

async function buildSignup(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/signup", {
      title: "Signup",
      nav,
      errors: null,
    });
  } catch (err) {
    console.error("Error in buildSignup:", err);
    next(err); // Pass the error to the error handler
  }
}
  
  module.exports = { buildLogin, buildSignup }