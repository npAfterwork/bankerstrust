import {ApiService, IAccountListResult} from '../../services/api.service';
import {SweetAlertService} from '../../services/swal.service';
import {IAccount, IAccountInfo} from '../../model/model';
import * as angular from 'angular';


class DashboardPage {
	isLoading: boolean;
	accounts: Array<IAccountInfo>;

	static $inject = ['$state', 'ApiService', '$mdDialog', 'SweetAlertService'];

	constructor(private $state: angular.ui.IStateService,
				private apiService: ApiService,
				private $mdDialog,
				private sweetAlert: SweetAlertService) {
		this.ngInit();
	}

	ngInit() {
		this.isLoading = true;
		this.apiService.getAccounts().then((res: IAccountListResult) => {
			this.isLoading = false;
			this.accounts = res.data;
		});
	}

	deleteAccount(event, accountInfo: IAccountInfo) {
		console.log('sdf');
		this.sweetAlert.warn({
			title: 'Are you sure?',
			text: 'You won\'t be able to revert this!',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then(
			(confirm) => {
				this.apiService.deleteAccount(accountInfo.account).then((res) => {
					if (res.data) {
						this.accounts.splice(this.accounts.indexOf(accountInfo), 1);
						this.sweetAlert.success({
							title: 'Deleted!',
							text: 'Your account has been deleted.',
						});
					}
				});
			},
			(dismiss) => {
				this.sweetAlert.info({text: 'Account NOT deleted'});
			}
		);

		// let confirm = this.$mdDialog.confirm()
		// 	.title('Would you like to delete this account?')
		// 	.textContent('The data will all gone. Really gone.')
		// 	.ariaLabel('Delete Account?')
		// 	.targetEvent(event)
		// 	.ok('Please do it')
		// 	.cancel('NO!');
		//
		// this.$mdDialog.show(confirm).then(() => {
		// 	this.apiService.deleteAccount(accountInfo.account).then((res) => {
		// 		if (res.data) {
		// 			this.accounts.splice(this.accounts.indexOf(accountInfo), 1);
		// 		}
		// 	});
		// }, function () {
		// 	// console.log('You decided to keep your account.');;
		// });
	}

	editAccount(event, accountInfo: IAccountInfo) {
		let account = angular.copy(accountInfo.account);
		this.$mdDialog.show({
			controller: ($scope, $mdDialog) => {
				$scope.account = account;
				$scope.hide = () => {
					$mdDialog.hide();
				};
				$scope.cancel = () => {
					$mdDialog.cancel();
				};
				$scope.answer = (answer) => {
					$mdDialog.hide(answer);
				};
				$scope.isValid = () => {
					return (account && account.name && account.name.length > 0);
				};
			},
			template: require('../../components/account-edit.template.html'),
			parent: angular.element(document.body),
			targetEvent: event,
			clickOutsideToClose: true
		})
			.then((answer) => {
				if (answer) {
					this.apiService.updateAccount(account).then((res) => {
						this.accounts[this.accounts.indexOf(accountInfo)] = res.data;
					});
				}
			}, () => {
				// console.log('You cancelled the dialog.');
			});
	}

	newAccount(event) {
		let account: IAccount = {
			id: '',
			name: ''
		};

		this.$mdDialog.show({
			controller: ($scope, $mdDialog) => {
				$scope.account = account;
				$scope.hide = () => {
					$mdDialog.hide();
				};
				$scope.cancel = () => {
					$mdDialog.cancel();
				};
				$scope.answer = (answer) => {
					$mdDialog.hide(answer);
				};
				$scope.isValid = () => {
					return (account && account.name && account.name.length > 0);
				};
			},
			template: require('../../components/account-edit.template.html'),
			parent: angular.element(document.body),
			targetEvent: event,
			clickOutsideToClose: true
		})
			.then((answer) => {
				if (answer) {
					this.apiService.newAccount(account).then((res) => {
						this.accounts.push(res.data);
					});
				}
			}, () => {
				// console.log('You cancelled the dialog.');
			});
	}
}

export {DashboardPage}
