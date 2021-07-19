const Eatery = require('../models/eatery');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
	const eatery = await Eatery.findById(req.params.id);
	const review = new Review(req.body.review);
	review.author = req.user._id;
	eatery.reviews.push(review);
	await review.save();
	await eatery.save();
	req.flash('success', 'New review created');
	res.redirect(`/eateries/${eatery._id}`);
};

module.exports.deleteReview = async (req, res, next) => {
	const { id, reviewId } = req.params;
	await Eatery.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
	await Review.findByIdAndDelete(reviewId);
	req.flash('success', 'Review deleted');
	res.redirect(`/eateries/${id}`);
};
