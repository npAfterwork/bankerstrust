import {ApiService, IAccountEntriesResult} from '../../../services/api.service';
import {IEntry} from '../../../model/model';

class AccountListComponent {
	isLoading: boolean;
	entries: Array<IEntry> = [];

	static $inject = ['$scope', '$state', '$stateParams', 'ApiService'];

	constructor(private $scope: angular.IScope,
				private $state: angular.ui.IStateService,
				private $stateParams: angular.ui.IStateParamsService,
				private apiService: ApiService) {
		this.ngInit();
	}

	ngInit() {
		this.isLoading = true;
		this.apiService.getAccountEntries(this.$stateParams['id']).then((res: IAccountEntriesResult) => {
			this.isLoading = false;
			this.entries = res.data;
		});
	}

}

export {AccountListComponent}
