'use strict';

// Dependencies

var path = require('path');

// Command: env NODE_ENV
// Project configurations

if (process.env.NODE_ENV === 'production') {
	module.exports = {
		name: 'RESTful API - ExperTIC',
		enviroment: 'production',
		db: 'mongodb://127.0.0.1/expertic',
		keys: {
			movil: 'bd90b560496a464c303794163b9cd60b1d301adf17179dd122f994cedeccbe484a0e049acf643c09f3f2f4fcedb04f9c8d3549f95374875e36f531b3874b04b5',
			app: 'bd90b560496a464c303794163b9cd60b1d301adf17179dd122f994cedeccbe484a0e049acf643c09f3f2f4fcedb04f9c8d3549f95374875e36f531b3874b04b5'
		},
	  	server: {
	    	port: 3000,
	    	host: "0.0.0.0",
	    	distFolder: path.resolve(__dirname, '../app')
	  	},
	  	mail: {
	  		service: 'gmail',
	  		auth: {
	  			user: '',
	  			pass: ''
	  		}
	  	}
	};
}
else {
	module.exports = {
		name: 'RESTful API - ExperTIC',
		enviroment: 'development',
		db: 'mongodb://127.0.0.1/expertic-dev',
		keys: {
			movil: 'bd90b560496a464c303794163b9cd60b1d301adf17179dd122f994cedeccbe484a0e049acf643c09f3f2f4fcedb04f9c8d3549f95374875e36f531b3874b04b5',
			app: 'bd90b560496a464c303794163b9cd60b1d301adf17179dd122f994cedeccbe484a0e049acf643c09f3f2f4fcedb04f9c8d3549f95374875e36f531b3874b04b5'
		},
	  	server: {
	    	port: 3000,
	    	host: "0.0.0.0",
	    	distFolder: path.resolve(__dirname, '../app')
	  	},
	  	mail: {
	  		service: 'gmail',
	  		auth: {
	  			user: '',
	  			pass: ''
	  		}
	  	}
	};
}
