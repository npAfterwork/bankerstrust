import {Routes} from './model/consts';

let AppRoutes = ($stateProvider: any, $urlRouterProvider: angular.ui.IUrlRouterProvider, $httpProvider: angular.IHttpProvider) => {
	$stateProvider
		.state(Routes.Contacts, {
			url: '/contacts',
			template: require('./pages/contacts/contacts.template.html'),
			controller: 'ContactsPage',
			controllerAs: 'contactsVm',
			menu: 'contacts'
		})
		.state(Routes.Dashboard, {
			url: '/dashboard',
			template: require('./pages/dashboard/dashboard.template.html'),
			controller: 'DashboardPage',
			controllerAs: 'dashboardVm',
			menu: 'dashboard'
		})
		.state(Routes.Account, {
			url: '/account/:id', // TOASK how does this work
			template: require('./pages/account/account.template.html'),
			controller: 'AccountPage',
			controllerAs: 'accountVm',
			menu: 'account'
		})
		.state(Routes.AccountList, {
			url: '/list',
			template: require('./pages/account/entries/account-entries.template.html'),
			controller: 'AccountListComponent',
			controllerAs: 'accountListVm',
			menu: 'account'
		})
		.state(Routes.AccountImport, {
			url: '/import',
			template: require('./pages/account/import/account-import.template.html'),
			controller: 'AccountImportComponent',
			controllerAs: 'accountImportVm',
			menu: 'account'
		});

	$urlRouterProvider.otherwise(Routes.Dashboard);
};

export {AppRoutes}
