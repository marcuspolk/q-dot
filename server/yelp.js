const db = require('../database/index.js');
const yelpAPIKey = require('./credentials/credentials.js');
const request = require('request');
const express = require('express');

const yelp = {
	get: (req, res, params) => {
		//console.log('inside yelp.js get fn');
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
				console.log(JSON.parse(body));
				res.send(JSON.parse(body));
			}
		};
		
	 	request(options, cb);
	 }
}

module.exports = yelp;
