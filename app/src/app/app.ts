import * as angular from 'angular';
import {AppRoutes} from './app.routes';
import {MainCtrl} from './app.component';
import {DashboardPage} from './pages/dashboard/dashboard.component';
import {ContactsPage} from './pages/contacts/contacts.component';
import {ApiService} from './services/api.service';
import {AccountPage} from './pages/account/account.component';
import {AccountListComponent} from './pages/account/entries/account-entries.component';
import {AccountImportComponent} from './pages/account/import/account-import.component';
import {EntryListComponent} from './components/entrylist.component';


let app = angular.module('app', ['ui.router', 'ngMaterial', 'ngAnimate', 'angularFileUpload', 'ngSanitize', 'smart-table'])
	.controller('MainCtrl', MainCtrl)
	.controller('DashboardPage', DashboardPage)
	.controller('ContactsPage', ContactsPage)
	.controller('AccountPage', AccountPage)
	.controller('AccountListComponent', AccountListComponent)
	.controller('AccountImportComponent', AccountImportComponent)
	.component('entrylist', new EntryListComponent())
	.service('ApiService', ApiService);

app.config(AppRoutes);

app.value('BASEAPI', 'api');

export {app}
