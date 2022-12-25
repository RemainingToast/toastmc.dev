import postcss from 'postcss';
import pug from 'pug';
import fs from 'fs-extra';
import tailwindcss from 'tailwindcss';
import { path, log } from './utils';

const css = (filename: string) => {
	const cssPath = path(filename);
	return fs.readFile(cssPath)
		.then((bytes) =>
			postcss([
				tailwindcss,
				require('autoprefixer')(),
				require('cssnano')(),
				require('postcss-font-magician')({
					protocol: 'https:',
				}),
			]).process(bytes, { from: cssPath, to: cssPath }))
		.then((result) => (result.warnings().forEach((warn) => log.warn(warn.toString())), result.css))
}

const pugRender = (pugFilename: string, cssFilename: string) =>
	css(cssFilename).then((css) => pug.renderFile(path(pugFilename), { css }));

function staticGen() {
	const pugFilename = 'views/index.pug';
	const cssFilename = 'tailwind.css';
	const htmlFilename = 'index.html';
	return pugRender(pugFilename, cssFilename)
		.then((html) => fs.writeFile(path(htmlFilename), html))
		.then(() => log.info(`Generated ${htmlFilename}`))
		.catch((err) => log.error(err));
}

staticGen();
