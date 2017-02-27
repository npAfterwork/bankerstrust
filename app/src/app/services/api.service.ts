import {IAccount, IEntry, IAccountInfo} from '../model/model';

interface IAccountListResult {
	data: Array<IAccountInfo>;
}

interface IAccountResult {
	data: IAccountInfo;
}

interface IAccountEntriesResult {
	data: Array<IEntry>;
}

class ApiService {

	static $inject = ['$q', '$http', '$state', 'BASEAPI'];

	constructor(private $q: angular.IQService, private $http: angular.IHttpService, private $state: angular.ui.IStateService, private baseUrl: string) {
	}

	public getAccounts(): angular.IPromise<IAccountListResult> {
		return this.$http.get(`${this.baseUrl}/accounts/list`);
	}

	public getAccount(id: string): angular.IPromise<IAccountResult> {
		return this.$http.get(`${this.baseUrl}/account/${id}/id`);
	}

	public getAccountEntries(id: string): angular.IPromise<IAccountEntriesResult> {
		return this.$http.get(`${this.baseUrl}/account/${id}/entries`);
	}

	public newAccount(account: IAccount): angular.IPromise<IAccountResult> {
		return this.$http.post(`${this.baseUrl}/accounts/new`, account);
	}

	public updateAccount(account: IAccount): angular.IPromise<IAccountResult> {
		return this.$http.post(`${this.baseUrl}/accounts/update`, account);
	}

	public deleteAccount(account: IAccount): angular.IPromise<IAccountResult> {
		return this.$http.post(`${this.baseUrl}/accounts/delete`, account);
	}
}

export {ApiService, IAccountResult, IAccountListResult, IAccountEntriesResult}
