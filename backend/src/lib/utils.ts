import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as async from 'async';

class Utils {

	static flow(functions: Array<(cb: IErrorCallback) => void>, cb: IErrorCallback) {
		async.waterfall(functions, cb);
	}

	static ensureDirectory(dir: string, cb: IErrorCallback) {
		fs.access(dir, fs.constants.R_OK | fs.constants.W_OK, (err) => {
			if (err && err.code === 'ENOENT') {
				fs.mkdir(dir, cb);
			} else {
				cb(err);
			}
		});
	}

	static queue(data: Array<any>, exec: (item: any, next: IErrorCallback) => void, final?: IErrorCallback, parallel?: number) {
		let q = async.queue(exec, parallel || 1);
		q.drain = final;
		q.push(data);
	};

	static asyncForEach(list: Array<any>, exec: (item: any, next: IErrorCallback) => void, final?: IErrorCallback) {
		async.forEachSeries(list, exec, final);
	};

	static dirs(dir: string, cb: (err?: any, result?: Array<string>) => void) {
		fs.readdir(dir, (err, content) => {
			let result = [];
			if (err) {
				return cb(err);
			}
			Utils.queue(content, (entry, next) => {
				if (entry[0] == '.') {
					return next();
				}
				fs.stat(path.join(dir, entry), (e, stat) => {
					if (e) {
						return cb(e);
					}
					if (stat.isDirectory()) {
						result.push(entry);
					}
					next();
				});
			}, function() {
				cb(null, result);
			});
		});
	};

	static files(dir: string, cb: (err?: any, result?: Array<string>) => void) {
		fs.readdir(dir, (err, content) => {
			let result = [];
			if (err) {
				return cb(err);
			}
			Utils.queue(content, (entry, next) => {
				if (entry[0] == '.') {
					return next();
				}
				fs.stat(path.join(dir, entry), (e, stat) => {
					if (e) {
						return cb(e);
					}
					if (!stat.isDirectory()) {
						result.push(entry);
					}
					next();
				});
			}, function() {
				cb(null, result);
			});
		});
	};

	static filesByExt(dir: string, ext: string, cb: (err?: any, result?: Array<string>) => void) {
		Utils.files(dir, (err, files) => {
			if (err) {
				return cb(err);
			}
			let result = files.filter(file => path.extname(file) == ext);
			cb(null, result);
		});
	};

	static readJson(file: string, cb: (err?: any, data?: any) => void) {
		fs.exists(file, exists => {
			if (!exists) {
				return cb();
			}
			fs.readFile(file, (err, data) => {
				if (err) {
					return cb(err);
				}
				try {
					let j = JSON.parse(data.toString());
					cb(null, j);
				} catch (err) {
					cb(err);
				}
			});
		});
	};

	static writeJson(file: string, data: any, cb: IErrorCallback) {
		fs.writeFile(file, JSON.stringify(data, null, '\t'), cb);
	}

	static hash(s: string): string {
		return crypto.createHash('sha256').update(s).digest('hex');
	}

	static removeQuotes(s: string): string {
		let cs = s.trim();
		if (cs[0] == '"' && cs[cs.length - 1] == '"') {
			return cs.slice(1, cs.length - 1).trim();
		}
		return s.trim();
	}

	static slug(): string {
		return crypto.pseudoRandomBytes(4).toString('hex');
	}

	static uniqueFilename(folder: string, cb: (result: string) => void) {
		let slug = Utils.slug();
		fs.exists(path.join(folder, slug), exists => {
			if (exists) {
				return Utils.uniqueFilename(folder, cb);
			}
			cb(slug);
		});
	}
}

export {Utils};
