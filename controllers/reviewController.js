const reviewModel = require("../models/review-model");
const utilities = require("../utilities");

async function buildReviewForm(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("review/reviewForm", {
      title: "Leave a Review",
      nav,
      errors: null,
      flash: req.flash("notice")
    });
  } catch (error) {
    next(error);
  }
}

async function submitReview(req, res, next) {
  try {
    
    const { rating, comment } = req.body;
    const account_id =
      req.body.account_id || (res.locals.accountData && res.locals.accountData.account_id);
      
    if (!account_id) {
      req.flash("notice", "You must be logged in to leave a review.");
      return res.redirect("/account/login");
    }    
   
    await reviewModel.addReview(account_id, rating, comment);
    req.flash("notice", "Thank you for your review!");
    res.redirect("/reviews");
  } catch (error) {
    next(error);
  }
}
async function showReviews(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const reviews = await reviewModel.getAllReviews();
    const ratingData = await reviewModel.getAverageRating();
    res.render("review/reviewDisplay", {
      title: "Customer Reviews",
      nav,
      reviews,
      ratingData,
      flash: req.flash("notice"),
      errors: null
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buildReviewForm,
  submitReview,
  showReviews
};
