import * as angular from 'angular';
require('angular-aria');
require('angular-animate');
require('angular-ui-router');
require('angular-sanitize');
require('angular-material');
require('angular-file-upload');
require('angular-smart-table');

require('angular-material/angular-material.css');
require('./assets/css/app.scss');

document.write(require("./app/app.template.html"));

const app = require('./app/app');
angular.element(document).ready(function () {
	angular.bootstrap(document, [app.app.name], {
		// strictDi: true
	});
});
