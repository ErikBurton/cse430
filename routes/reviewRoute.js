const express = require("express");
const router = new express.Router();
const reviewController = require("../controllers/reviewController");
const utilities = require("../utilities");

router.get("/review", utilities.handleErrors(reviewController.buildReviewForm));

router.post("/review", utilities.handleErrors(reviewController.submitReview));

router.get("/reviews", utilities.handleErrors(reviewController.showReviews));

module.exports = router;
