const db = require('../database/index.js');
const yelpAPIKey = require('./credentials/credentials.js');
const request = require('request');

const yelp = {
	// get: (req, res, paramObj) => {
	// 	$.ajax({
	// 		url: 'https://api.yelp.com/v3/businesses/search?' + $.param({term: 'pizza', location: 'san francisco'}),
	// 		method: 'GET',
	// 		headers: {'Authorization': 'Bearer ' + yelpAPIKey.access_token},
	// 		success: (restaurants) => {
	// 			console.log(restaurants);
	// 			// do something with restaurants array
	// 			res.send('restaurants: ', restaurants);
	// 		},
	// 		error: (err) => {
	// 			console.error(err);
	// 		}
	// 	});
	// }

	// get: request
	// 	.get('https://api.yelp.com/v3/businesses/search?')
	// 	.auth(null, null, true, yelpAPIKey.access_token)

	// get: request({url: 'https://api.yelp.com/v3/businesses/search?', qs: urlParams}, function(err, response, body) {
		// 	if (err) {
		// 		console.error(err);
		// 	}
		// 	console.log('Yelp GET request was a success!');
		// 	console.log('response: ', response);
		// 	console.log('body: ', body);
		// })

		 get: (req, res, params) => {
		 	const options = {
				url: 'https://api.yelp.com/v3/businesses/search?',
				headers: {
					Authorization: 'Bearer ' + yelpAPIKey.access_token 
				},
				qs: params
			};
			const cb = function(error, response, body) {
				if (error) {
					console.error(error);
				}
				console.log(response.statusCode);
				//console.log('cb response: ', response);
				//console.log('cb body: ', body);
				res.send(body);
			};
		 	request(options, cb);
		 }


	// get: (req, res) => {
	// 	console.log('function was called');
	// 	console.log('req: ', req);
	// 	console.log('res: ', res);
	// }
}

module.exports = yelp;
