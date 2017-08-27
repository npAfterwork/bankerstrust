import {AngularServices} from './model/consts';

class MainCtrl implements angular.IController {
	version = '0.1';

	static $inject = [AngularServices.RootScope, AngularServices.State, AngularServices.Log];

	constructor(private $rootScope: any, private $state: angular.ui.IStateService, private $log: angular.ILogService) {
		this.$rootScope.$state = this.$state;
	}

	$onInit(): void {
		this.$log.debug('init main ctrl');
	}

}

export {MainCtrl}
