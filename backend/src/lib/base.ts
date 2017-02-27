import {Contacts} from './contacts';
import {ServerAccounts} from './accounts';
import * as path from 'path';
import {Utils} from './utils';

class Base {
	contacts: Contacts;
	accounts: ServerAccounts;
	data_path: string;

	constructor(config) {
		this.data_path = path.resolve(config.paths.data);
		this.contacts = new Contacts(this.data_path);
		this.accounts = new ServerAccounts(path.resolve(this.data_path, 'accounts'));
	}

	init(cb: IErrorCallback) {
		Utils.flow([
			(next) => {
				Utils.ensureDirectory(this.data_path, next);
			},
			(next) => {
				Utils.ensureDirectory(path.resolve(this.data_path, 'accounts'), next);
			},
			(next) => {
				this.contacts.load(next);
			},
			(next) => {
				this.accounts.load(next);
			}
		], cb);
	};
}

export {Base};
