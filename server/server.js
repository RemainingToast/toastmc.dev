require('dotenv').config();

const { log, path } = require('./utils');
const cluster = require('cluster');
const express = require('express');
const app = express();

const CONFIG = {
	views: path('../views/pages'),
	static: path('../static'),
	images: path('../images')
};

// Only allow paths ending in trailing slash (/) (except for direct file paths)
app.enable('strict routing');

// Allow cases in paths (used for uploads/static files with capitalization)
app.enable('case sensitive routing');

/*  Compress any eligible traffic;
	security enhancements;
	logging for Express functions;
	modern Favicon serving */
app.use(require('compression')());
app.use(require('helmet')({
	frameguard: false
}));
app.use(require('express-pino-logger')({ logger: log }));
//app.use(require('serve-favicon')(CONFIG.icon)); //TODO

// Static Express routes (for JavaScript, images, robots.txt, manifests, etc.)
app.use(express.static(CONFIG.static));
app.use('/images', express.static(CONFIG.images));

// Route handler
app.use(require('./router'));

// Pug.js renderer
app.set('views', CONFIG.views);
app.set('view engine', 'pug');

// Call proper task for multithreading
cluster.isMaster ? masterThread() : workerThread();

function masterThread() {
	// One thread per CPU
	let cpus = require('os').cpus().length;
	log.info(`Forking ${cpus} worker threads`);

	// Create new threads for each CPU core
	for (let cpu = 0; cpu < cpus; cpu++) cluster.fork();

	cluster.on('online', (worker) => log.info(`Worker online [${worker.id}]`));
	cluster.on('exit', (worker, code, signal) => {
		log.warn(`Worker exited, reason: ${signal || code} [${worker.id}]`);
		cluster.fork();
	});
}

// Thread for worker (spawned by master thread at launch or after another thread crashed)
function workerThread() {
	app.listen(process.env.PORT, () => log.info(`Server hosted (0.0.0.0:${process.env.PORT}) [${cluster.worker.id}]`));
}