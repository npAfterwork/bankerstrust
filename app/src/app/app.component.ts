import {AngularServices} from './model/consts';

class MainCtrl {
	version = '0.1';

	static $inject = [AngularServices.RootScope, AngularServices.State];

	constructor(private $rootScope: any, private $state: angular.ui.IStateService) {
		this.$rootScope.$state = this.$state;
	}
}

export {MainCtrl}
