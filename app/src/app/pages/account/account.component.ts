import {ApiService, IAccountResult} from '../../services/api.service';
import {IAccountInfo} from '../../model/model';

class AccountPage {
	isLoading: boolean;
	accountInfo: IAccountInfo;

	static $inject = ['$scope', '$state', '$stateParams', 'ApiService'];

	constructor(private $scope: angular.IScope,
				private $state: angular.ui.IStateService,
				private $stateParams: angular.ui.IStateParamsService,
				private apiService: ApiService) {
		this.ngInit();
	}

	ngInit() {
		this.isLoading = true;
		this.apiService.getAccount(this.$stateParams['id']).then((res: IAccountResult) => {
			this.isLoading = false;
			this.accountInfo = res.data;
		});
	}
}

export {AccountPage}
