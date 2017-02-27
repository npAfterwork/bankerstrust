import {ApiService} from '../../../services/api.service';

class AccountImportComponent {
	uploader: any;
	account_id: string;

	static $inject = ['$scope', '$state', '$stateParams', 'ApiService', 'FileUploader'];

	constructor(private $scope: angular.IScope,
				private $state: angular.ui.IStateService,
				private $stateParams: angular.ui.IStateParamsService,
				private apiService: ApiService,
				private FileUploader) {
		this.ngInit();
	}

	ngInit() {
		this.account_id = this.$stateParams['id'];
		let uploader = new this.FileUploader();
		uploader.url = 'api/account/' + this.account_id + '/import';
		// uploader.filters.push({
		// 	name: 'customFilter',
		// 	fn: function(item /*{File|FileLikeObject}*/, options) {
		// 		return this.queue.length < 10;
		// 	}
		// });

		uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
			// console.info('onWhenAddingFileFailed', item, filter, options);
		};
		uploader.onAfterAddingFile = function(fileItem) {
			// console.info('onAfterAddingFile', fileItem);
			fileItem.upload({parse: true});
		};
		uploader.onAfterAddingAll = function(addedFileItems) {
			// console.info('onAfterAddingAll', addedFileItems);
		};
		uploader.onBeforeUploadItem = function(item) {
			// console.info('onBeforeUploadItem', item);
		};
		uploader.onProgressItem = function(fileItem, progress) {
			// console.info('onProgressItem', fileItem, progress);
		};
		uploader.onProgressAll = function(progress) {
			// console.info('onProgressAll', progress);
		};
		uploader.onSuccessItem = function(fileItem, response, status, headers) {
			// console.info('onSuccessItem', fileItem, response, status, headers);
		};
		uploader.onErrorItem = function(fileItem, response, status, headers) {
			fileItem.error = response;
			// console.info('onErrorItem', fileItem, response, status, headers);
		};
		uploader.onCancelItem = function(fileItem, response, status, headers) {
			// console.info('onCancelItem', fileItem, response, status, headers);
		};
		uploader.onCompleteItem = function(fileItem, response, status, headers) {
			fileItem.response = response[0];
			// console.info('onCompleteItem', fileItem, response, status, headers);
		};
		uploader.onCompleteAll = function() {
			// console.info('onCompleteAll');
		};

		this.uploader = uploader;
	}

	importInvoice(fileItem) {
		fileItem.formData.push({apply: true});
		fileItem.upload();
	}

}

export {AccountImportComponent}
