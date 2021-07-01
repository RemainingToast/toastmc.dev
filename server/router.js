const { log, path } = require('./utils');
const Sass = require('node-sass');
const router = require('express').Router();

// CSS
router.get('/css', (_req, res, next) => Sass.render({ file: path('../sass/main.scss'), outputStyle: 'compressed' }, (err, result) => err ? next(err) : res.type('css').send(result.css)));

router.get('*', (req, res) =>
	(req.url !== '/' && !req.url.endsWith('/'))
		? res.redirect(301, `${req.url}/`)
		: res.render('index', { isProd: process.env.NODE_ENV === 'production' }));

// HTTP 404
router.use((_req, res) => res.status(404).send('lol error 404'));

// HTTP 500
router.use((err, _req, res, _next) => {
	log.error(err.stack);
	res.status(500).send('lol error 500');
});

module.exports = router;
