const Path = require('path');
const log = require('pino')({ prettyPrint: process.env.NODE_ENV !== 'production' });

module.exports = {
	log,
	path: (file) => Path.join(__dirname, file)
};
