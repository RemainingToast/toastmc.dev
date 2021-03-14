const { log, path } = require('./utils');
const fs = require('fs-extra');
const Sass = require('node-sass');
const minify = require('@node-minify/core');
const uglify = require('@node-minify/uglify-es');
const router = require('express').Router();

module.exports = router;

//router.use(require('express-fileupload')()); //TODO

router.get('/css', (_req, res, next) => {
	Sass.render({
		file: path('../sass/main.scss'),
		outputStyle: 'compressed'
	}, (err, result) => {
		err ? next(err) : res.type('css').send(result.css);
	});
});

router.get('*', (req, res, next) => {
	let url = req.url;

	if (url !== '/' && !url.endsWith('/'))
		return res.redirect(301, url + '/');

	let page = url === '/' ? 'index' : url.substring(1, url.length - 1);
	res.render('index', {
		isProd: process.env.NODE_ENV === 'production'
	});
});

// HTTP 404
router.use((_req, res) => res.status(404).send('lol error 404'));

// HTTP 500
router.use((err, _req, res, _next) => {
	log.error(err.stack);
	res.status(500).send('lol error 500');
});