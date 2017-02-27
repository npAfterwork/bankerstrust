import {IAccount, IAccountInfo} from '../../../app/src/app/model/model';
import {Utils} from './utils';
import {ServerAccount} from './account';
import {Reader} from './reader';
import * as path from 'path';
import * as fs from 'fs';
import {IReaderResult} from './reader.interface';

class ServerAccounts {
	accounts: Array<ServerAccount> = [];
	dir: string;

	constructor(dir) {
		this.dir = dir;
	}

	newAccount(initValues: IAccount, cb: (err?: any, account?: ServerAccount) => void) {
		Utils.uniqueFilename(this.dir, id => {
			let account = new ServerAccount();
			if (initValues) {
				account.data = initValues;
			}
			account.data.id = id;
			account.save(this.dir, err => {
				if (err) {
					cb(err);
				} else {
					this.accounts.push(account);
					cb(null, account);
				}
			});
		});
	}

	updateAccount(updateValues: IAccount, cb: (err?: any, account?: ServerAccount) => void) {
		let account = this.accounts.filter(a => a.data.id == updateValues.id)[0];
		if (!account) {
			return cb('Account not found');
		}
		account.update(updateValues);
		account.save(this.dir, err => {
			if (err) {
				cb(err);
			} else {
				cb(null, account);
			}
		});
	}

	deleteAccount(updateValues: IAccount, cb: (err?: any, account?: ServerAccount) => void) {
		let account = this.accounts.filter(a => a.data.id == updateValues.id)[0];
		if (!account) {
			return cb('Account not found');
		}
		this.accounts.splice(this.accounts.indexOf(account), 1);
		account.remove(this.dir, err => {
			if (err) {
				cb(err);
			} else {
				cb(null, account);
			}
		});
	}

	importFile(account_id: string, filename: string, apply: boolean, cb: (err: any, result?: IReaderResult) => void) {
		fs.readFile(filename, (err, data) => {
			if (err) {
				return cb(err);
			}
			this.importData(account_id, data, apply, cb);
		});
	}

	importData(account_id: string, data: Buffer, apply: boolean, cb: (err: any, result?: IReaderResult) => void) {
		let account = this.accounts.filter(a => a.data.id == account_id)[0];
		if (!account) {
			return cb('Account not found');
		}
		let reader = new Reader();
		reader.readBuffer(data, account.data.bank, (err, result) => {
			if (err) {
				return cb(err);
			}
			if (apply && result.invoice) {
				console.log('import', apply);
				account.importInvoice(result.invoice);
				account.save(this.dir, e => {
					if (e) {
						return cb(e);
					}
					cb(null, result);
				});
			} else {
				cb(null, result);
			}
		});
	}

	importFiles(account_id: string, filenames: Array<string>, apply: boolean, cb: (err: any, results?: Array<IReaderResult>) => void) {
		if (!filenames || filenames.length === 0) {
			return cb('Nothing to import');
		}
		let results = [];
		Utils.asyncForEach(filenames, (filename, next) => {
			this.importFile(account_id, filename, apply, (err, result) => {
				if (err) {
					return cb(err);
				}
				results.push(result);
				next();
			});
		}, () => {
			cb(null, results);
		});
	}

	load(cb: IErrorCallback) {
		Utils.files(this.dir, (err, files) => {
			if (err) {
				return cb(err);
			}
			Utils.queue(files, (file, next) => {
				let account = new ServerAccount();
				account.load(path.join(this.dir, file), e => {
					if (e) {
						return cb(e);
					}
					this.accounts.push(account);
					next();
				});
			}, cb);
		});
	};

	get(id: string): ServerAccount {
		return this.accounts.filter(a => a.data.id == id)[0];
	}

	infos(): Array<IAccountInfo> {
		return this.accounts.sort((a, b) => {
			if (a.data.name < b.data.name) {
				return -1;
			}
			if (a.data.name > b.data.name) {
				return 1;
			}
			return 0;
		}).map(a => a.info());
	};

}

export {ServerAccounts}
