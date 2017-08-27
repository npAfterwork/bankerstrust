import * as angular from 'angular';
import {ApiService} from '../../services/api.service';
import {IAccountInfo} from '../../model/model';
import {AngularServices} from '../../model/consts';

class AccountPage {
	isLoading: boolean;
	accountInfo: IAccountInfo;

	static $inject = ['$scope', '$state', '$stateParams', 'ApiService', AngularServices.Log];

	constructor(private $scope: angular.IScope,
				private $state: angular.ui.IStateService,
				private $stateParams: angular.ui.IStateParamsService,
				private apiService: ApiService,
				private $log: angular.ILogService) {
	}

	$onInit(): void {
		this.$log.debug('init Account Page');
		this.isLoading = true;
		this.apiService.getAccount(this.$stateParams['id']).then((res: angular.IHttpPromiseCallbackArg<IAccountInfo>) => {
			this.isLoading = false;
			this.accountInfo = res.data;
		});

	}

}

export {AccountPage}
