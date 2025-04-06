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

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  } catch (err) {
    console.error("Error in buildRegister", err);
    next(err);
  }
}

/* ****************************************
*  Process Sign Up
* *************************************** */
async function signupAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.signupAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Sign Up",
      nav,
    })
  }
}
  
  module.exports = { buildLogin, buildRegister }