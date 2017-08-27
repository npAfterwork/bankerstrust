import {ApiService} from '../../../services/api.service';
import {IEntry} from '../../../model/model';
import {AngularServices} from '../../../model/consts';

class AccountListComponent {
	isLoading: boolean;
	entries: Array<IEntry> = [];

	static $inject = ['$scope', '$state', '$stateParams', 'ApiService', AngularServices.Log];

	constructor(private $scope: angular.IScope,
				private $state: angular.ui.IStateService,
				private $stateParams: angular.ui.IStateParamsService,
				private apiService: ApiService,
				private $log: angular.ILogService) {
	}

	$onInit(): void {
		this.$log.debug('init AccountListComponent');
		this.isLoading = true;
		this.apiService.getAccountEntries(this.$stateParams['id']).then((res: angular.IHttpPromiseCallbackArg<Array<IEntry>>) => {
			this.isLoading = false;
			this.entries = res.data;
		});
	}
}

export {AccountListComponent}
