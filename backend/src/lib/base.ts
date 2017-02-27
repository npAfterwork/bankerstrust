import {Contacts} from './contacts';
import {ServerAccounts} from './accounts';
import * as path from 'path';

class Base {
	contacts: Contacts;
	accounts: ServerAccounts;

	constructor(config) {
		this.contacts = new Contacts(path.resolve(config.paths.data));
		this.accounts = new ServerAccounts(path.resolve(config.paths.data, 'accounts'));
	}

	init(cb: IErrorCallback) {
		this.contacts.load(e => {
			if (e) {
				return cb(e);
			}
			this.accounts.load(cb);
		});
	};
}

export {Base};
