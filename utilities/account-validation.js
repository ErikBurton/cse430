const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")


/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registrationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), 
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), 
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
        .trim()
        .escape()
        .notEmpty()
        .isEmail()
        .normalizeEmail() 
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
          const emailExists = await accountModel.checkExistingEmail(account_email)
          if (emailExists){
            throw new Error("Email exists. Please log in or use different email")
          }
        }),

      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

 /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }
  

  const updateAccountRules = () => {
    return [
      body("firstname")
        .trim()
        .notEmpty()
        .withMessage("First name is required."),
      body("lastname")
        .trim()
        .notEmpty()
        .withMessage("Last name is required."),
      body("email")
        .trim()
        .isEmail()
        .withMessage("A valid email is required."),
    ];
  };
  
  const passwordRules = () => {
    return [
      body("password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password must be at least 12 characters and include an uppercase letter, number, and special character."),
    ];
  };
  
  const checkUpdateData = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("account/update", {
        title: "Update Account",
        errors: errors.array(),
        accountData: req.body,
      });
    }
    next();
  };
  
  const checkPasswordData = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("account/update", {
        title: "Update Account",
        errors: errors.array(),
        accountData: req.body,
      });
    }
    next();
  };
  
  console.log("Exporting:", {
    updateAccountRules,
    passwordRules,
    checkUpdateData,
    checkPasswordData
  });

  module.exports = {
    ...validate,
    updateAccountRules,
    passwordRules,
    checkUpdateData,
    checkPasswordData,
  };
  
  
