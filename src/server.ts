const PORT = 8237;

import fs from 'fs-extra';
import { log, path, isProd } from './utils';
import { file as favi } from '@tycrek/nofavicon';
import { epcss } from '@tycrek/express-postcss';
import { facked } from '@tycrek/facked-awesome';
import tailwindcss from 'tailwindcss';
import express from 'express';
import helmet from 'helmet';
import { execSync } from 'child_process';

const pkg: { name: string, version: string } = fs.readJsonSync(path('package.json'));

// Express
const app = express();

// Enable/disable Express features
app.enable('case sensitive routing');
app.disable('x-powered-by');

// Set Express variables
app.set('trust proxy', true);
app.set('view engine', 'pug');
app.set('views', path('views'));

/*  Compress any eligible traffic;
	security enhancements;
	logging for Express functions;
	modern Favicon serving */
app.use(helmet({
	frameguard: false,
	contentSecurityPolicy: false
}));

// Favicon
app.use(favi(path('images/icons/favicon.ico')));

// Static & images
app.use(express.static(path('static')));
app.use('/assets', express.static(path('assets')));
app.use('/images', express.static(path('images')));

app.listen(PORT, () => log.info(`Server hosted (0.0.0.0:${PORT})`));

// CSS
app.use('/css', epcss({
	cssPath: path('tailwind.css'),
	plugins: [
		tailwindcss,
		require('autoprefixer')(),
		require('cssnano')(),
		require('postcss-font-magician')(),
	],
	warn: (warning: Error) => log.warn('PostCSS', warning.toString())
}));

// Facked
app.use('/facked.js', facked('bbe1d43ee9'));

// Index
app.get('/', (_req, res) => res.render('index', { isProd }));

// Start
log.debug(`Starting ${pkg.name} v${pkg.version} in mode`, isProd ? 'production' : 'development')
	.express()!.Host(app, PORT, '0.0.0.0');
