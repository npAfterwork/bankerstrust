import {Utils} from './utils';
import {IContact} from '../../../app/src/app/model/model';
import * as path from 'path';

class Contacts {
	entries: Array<IContact> = [];
	dir: string;

	constructor(dir: string) {
		this.dir = dir;
	}

	load(cb: IErrorCallback) {
		Utils.readJson(path.join(this.dir, 'contacts.json'), (err, data) => {
			if (err) {
				return cb(err);
			}
			if (data) {
				this.entries = data;
			}
			cb();
		});
	};

	change(key: string, val: string, cb: IErrorCallback) {
		let d = this.find(key);
		if (!d) {
			return cb('Item not found');
		}
		d.value = val;
		this.save(cb);
	};

	json(): Object {
		return this.entries;
	};

	find(key: string): IContact {
		return this.entries.filter(d => (d.key == key))[0];
	};

	findOrCreate(key: string): IContact {
		let d = this.find(key);
		if (!d) {
			d = {key: key, value: key};
			this.entries.push(d);
		}
		return d;
	};

	save(cb: IErrorCallback) {
		Utils.writeJson(path.join(this.dir, 'contacts.json'), this.entries, cb);
	};
}

export {Contacts}
