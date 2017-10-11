const db = require('../database/index.js');
const yelpAPIKey = require('./credentials/credentials.js');
const jquery = require('jquery');

const yelp = {
	get: (req, res, paramObj) => {
		jquery.ajax({
			url: 'https://api.yelp.com/v3/businesses/search?' + jquery.param({term: 'pizza', location: 'san francisco'}),
			method: 'GET',
			headers: {'Authorization': 'Bearer ' + yelpAPIKey.access_token},
			success: (restaurants) => {
				console.log(restaurants);
				// do something with restaurants array
				res.send('restaurants: ', restaurants);
			},
			error: (err) => {
				console.error(err);
			}
		});
	}
}

module.exports = yelp;
