const utilities = require('../utilities')
const accountModel = require('../models/account-model');
const bcrypt = require("bcryptjs")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    try {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
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
async function registerAccount(req, res) {
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  let nav = await utilities.getNav()
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
  const regResult = await accountModel.registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      flash: req.flash("notice"),
      errors: null
    });
    
  } else {

    
    
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      flash: req.flash("notice") 
    });
  }
}

async function showUpdateForm(req, res) {
  const account_id = req.params.account_id;
  const accountData = await accountModel.getAccountById(account_id); // create this in your model

  res.render("account/update", {
    title: "Update Account",
    accountData
  });
}
  
async function updateAccount(req, res) {
  const { firstname, lastname, email, account_id } = req.body;
  const result = await accountModel.updateAccountInfo(firstname, lastname, email, account_id);

  if (result) {
    req.flash("notice", "Account information updated successfully.");
  } else {
    req.flash("notice", "Account update failed. Please try again.");
  }

  const accountData = await accountModel.getAccountById(account_id);
  res.render("account/management", {
    title: "Account Management",
    accountData
  });
}

async function updatePassword(req, res) {
  const { password, account_id } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await accountModel.updatePassword(hashedPassword, account_id);

    if (result) {
      req.flash("notice", "Password updated successfully.");
    } else {
      req.flash("notice", "Password update failed. Try again.");
    }

    const accountData = await accountModel.getAccountById(account_id);
    res.render("account/management", {
      title: "Account Management",
      accountData
    });
  } catch (error) {
    console.error("Password update error:", error.message);
    req.flash("notice", "An error occurred. Try again.");
    res.redirect("/account");
  }
}

async function logout(req, res) {
  res.clearCookie("jwt"); 
  req.flash("notice", "You have been logged out.");
  res.redirect("/");
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  showUpdateForm,
  updateAccount,      
  updatePassword,       
  logout
};