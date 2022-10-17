// Colors
const background = '#252624';
const text = '#ECEFF1';

// Social
const website = '#03A9F4';
const email = '#CFD8DC';
const github = '#fff';
const discord = '#7289DA';
const youtube = '#FF0000';
const twitch = '#6441A4';
const twitter = '#1da1f2';
const steam = '#C5C3C0';
const spotify = '#1DB954';
const patreon = '#FF424D';

module.exports = {
	separator: '_',
	darkMode: 'class',
	plugins: [
	],
	content: ['./views/**/*.pug'],
	theme: {
		extend: {
			fontFamily: {
				main: ['Kanit', 'ui-sans-serif', 'system-ui', 'sans-serif']
			},
			colors: {
				background,
				text,
				website,
				email,
				github,
				discord,
				youtube,
				twitch,
				twitter,
				steam,
				spotify,
				patreon
			},
			width: {
			},
			height: {
			},
		}
	}
};
