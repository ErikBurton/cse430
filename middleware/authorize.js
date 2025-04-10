function checkAccountType (req, res, next) {
    const account = res.locals.accountData

    if (!account) {
        req.flash("notice", "You must be logged in to access this area.")
        return res.redirect("/account/login")
    }

    if (account.account_type === "Employee" || account.account_type === "Admin") {
        return next()
    }

    req.flash("notice", "You do not have permission to access this area.")
    return res.redirect("/account/login")
}   

module.exports = { checkAccountType }