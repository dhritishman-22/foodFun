const Eatery = require('../models/eatery');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
	const eateries = await Eatery.find();
	res.render('eateries/index', { eateries });
};

module.exports.renderNewForm = (req, res) => {
	res.render('eateries/new');
};

module.exports.createEatery = async (req, res, next) => {
	const geoData = await geocoder
		.forwardGeocode({
			query: req.body.eatery.location,
			limit: 1
		})
		.send();
	const eatery = new Eatery(req.body.eatery);
	eatery.geometry = geoData.body.features[0].geometry;
	eatery.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
	eatery.author = req.user._id;
	await eatery.save();
	req.flash('success', 'Eatery created');
	res.redirect(`/eateries/${eatery._id}`);
};

module.exports.showEatery = async (req, res) => {
	const eatery = await Eatery.findById(req.params.id)
		.populate({
			path: 'reviews',
			populate: {
				path: 'author'
			}
		})
		.populate('author');
	if (!eatery) {
		req.flash('error', 'Not found!');
		return res.redirect('/eateries');
	}
	res.render('eateries/show', { eatery });
};

module.exports.renderEditForm = async (req, res) => {
	const { id } = req.params;
	const eatery = await Eatery.findById(id);
	if (!eatery) {
		req.flash('error', 'Not found!');
		return res.redirect('/eateries');
	}
	res.render('eateries/edit', { eatery });
};

module.exports.updateEatery = async (req, res) => {
	const { id } = req.params;
	const eatery = await Eatery.findByIdAndUpdate(id, { ...req.body.eatery });
	const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
	eatery.images.push(...imgs);
	await eatery.save();
	req.flash('success', 'Eatery updated');
	res.redirect(`/eateries/${id}`);
};

module.exports.deleteEatery = async (req, res) => {
	const { id } = req.params;
	await Eatery.findByIdAndDelete(id);
	req.flash('success', 'Eatery deleted');
	res.redirect('/eateries');
};
