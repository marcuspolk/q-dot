const db = require('../database/index.js');
const yelpAPIKey = require('./credentials/credentials.js');
const request = require('request');
const express = require('express');

const yelp = {
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
				res.send(null);
			} else {
				body = JSON.parse(body);
				body = body.businesses[0];
				db.Restaurant.findOrCreate({
					where: {
						name: body.name, 
						phone: body.display_phone, 
						image: body.image_url, 
						rating: body.rating, 
						reviewCount: body.review_count,
						address: body.location.address1 + ' ' + body.location.city + ' ' + body.location.state + ' ' + body.location.zip_code, 
						yelpID: body.id, 
						latitude: body.coordinates.latitude, 
						longitude: body.coordinates.longitude
					}
				})
				res.send('successfully added new restaurant');
			}
		};
		
	 	request(options, cb);
	 }
}

module.exports = yelp;
