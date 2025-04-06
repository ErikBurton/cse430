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
  
  module.exports = { buildLogin }