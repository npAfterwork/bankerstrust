import {IAccount, IEntry, IAccountInfo} from '../model/model';

class ApiService {

	static $inject = ['$q', '$http', '$state', 'BASEAPI'];

	constructor(private $q: angular.IQService, private $http: angular.IHttpService, private $state: angular.ui.IStateService, private baseUrl: string) {
	}

	public getAccounts(): angular.IHttpPromise<Array<IAccountInfo>> {
		return this.$http.get(`${this.baseUrl}/accounts/list`);
	}

	public getAccount(id: string): angular.IHttpPromise<IAccountInfo> {
		return this.$http.get(`${this.baseUrl}/account/${id}/id`);
	}

	public getAccountEntries(id: string): angular.IHttpPromise<Array<IEntry>> {
		return this.$http.get(`${this.baseUrl}/account/${id}/entries`);
	}

	public newAccount(account: IAccount): angular.IHttpPromise<IAccountInfo> {
		return this.$http.post(`${this.baseUrl}/accounts/new`, account);
	}

	public updateAccount(account: IAccount): angular.IHttpPromise<IAccountInfo> {
		return this.$http.post(`${this.baseUrl}/accounts/update`, account);
	}

	public deleteAccount(account: IAccount): angular.IHttpPromise<IAccountInfo> {
		return this.$http.post(`${this.baseUrl}/accounts/delete`, account);
	}
}

export {ApiService}
