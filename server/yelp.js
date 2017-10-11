const db = require('../database/index.js');
const yelpAPIKey = require('./credentials/credentials.js');
const $ = require('jquery');

const yelp = {
	get: (req, res) => {
		$.ajax({
			url: 'https://api.yelp.com/v3/businesses/search',
			method: 'GET',
			headers: {'Authorization': 'Bearer ' + yelpAPIKey.access_token},
			data: {
				term: 'businessNameFromUserInputHere',
				location: 'cityNameWithSpacesReplacedBy"+"',
				limit: 10
			}
			success: (restaurants) => {
				console.log(restaurants);
				// do something with restaurants array
			},
			error: (err) => {
				console.error(err);
			}
		});
	}
}

module.exports = yelp;
