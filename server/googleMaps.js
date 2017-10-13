const db = require('../database/index.js');
const { api_key } = require('./credentials/googleAPI.js');
const request = require('request');
const express = require('express');

const requestDistance = (params, cb) => {
	let options = {
		url: 'https://maps.googleapis.com/maps/api/directions/json?',
		headers: {
			'Content-Type': 'jsonp'
		},
		qs: {
      origin: params.origin,
      destination: params.destination,
      mode: params.mode,
      key: api_key
		}
	};
	request(options, (err, response, body) => {
		cb(JSON.parse(body).routes[0].legs[0]);
	});
};

module.exports = requestDistance;
