import { TLog, DateTimePreset } from '@tycrek/log';
import IsProd from '@tycrek/isprod';
import Path from 'path';

//#region Logging
const logger = new TLog({
	//@ts-ignore
	level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
	timestamp: {
		enabled: true,
		colour: 'grey',
		preset: DateTimePreset.DATETIME_MED
	},
});

// Enable the Express logger
logger.enable.express({
	handle404: true,
	handle500: false,
	middleware: {
		excludePaths: ['favicon.ico',]
	},
	trim: {
		enabled: true,
		delim: '...',
		maxLength: 40
	}
}).debug('Plugin enabled', 'Express');

// Export for others to use
export const log = logger;

export function getRandomArbitrary(min: number, max: number) {
	return Math.random() * (max - min) + min;
}
//#endregion

export const path = (...args: string[]) => Path.join(process.cwd(), ...args);
export const isProd = IsProd();
