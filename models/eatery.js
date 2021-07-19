const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const EaterySchema = new Schema(
	{
		title: String,
		images: [
			{
				url: String,
				filename: String
			}
		],
		geometry: {
			type: {
				type: String,
				enum: [ 'Point' ],
				required: true
			},
			coordinates: {
				type: [ Number ],
				required: true
			}
		},
		location: String,
		price: Number,
		description: String,
		author: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		reviews: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Review'
			}
		]
	},
	opts
);

EaterySchema.virtual('properties.popUpMarkup').get(function() {
	return `<strong><a href="/eateries/${this._id}">${this.title}</a><strong>`;
});

EaterySchema.post('findOneAndDelete', async function(doc) {
	if (doc) {
		await Review.deleteMany({
			_id: {
				$in: doc.reviews
			}
		});
	}
});

module.exports = mongoose.model('Eatery', EaterySchema);
