import {IAccount, IInvoice, IEntry, IAccountInfo} from '../../../app/src/app/model/model';
import {Utils} from './utils';
import * as fs from 'fs';
import * as path from 'path';
import * as deepcopy from 'deepcopy';

class ServerAccount {
	data: IAccount = {
		name: '',
		id: ''
	};
	entries: Array<IEntry> = [];

	constructor() {
	}

	load(filename: string, cb: IErrorCallback) {
		Utils.readJson(filename, (err, data) => {
			if (err) {
				return cb(err);
			}
			if (data) {
				this.data = data;
				this.entries = data.entries;
				delete data.entries;
			}
			cb();
		});
	}

	update(updateValues: IAccount) {
		Object.keys(updateValues).forEach(key => {
			if (key !== 'id') {
				this.data[key] = updateValues[key];
			}
		});
	}

	remove(folder: string, cb: IErrorCallback) {
		if (this.data.id) {
			fs.unlink(path.resolve(folder, this.data.id), cb);
		}
	}

	save(folder: string, cb: IErrorCallback): void {
		let save = deepcopy(this.data);
		save.entries = this.entries;
		Utils.writeJson(path.resolve(folder, this.data.id), save, (err) => {
			cb(err);
		});
	}

	info(): IAccountInfo {
		return {account: this.data, entries_count: this.entries.length};
	}

	importInvoice(invoice: IInvoice): void {
		this.entries = this.entries.concat(invoice.entries);
	}

}

export {ServerAccount}
