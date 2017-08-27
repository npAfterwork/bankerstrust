import {AccountStats} from '../model/account-stats';
import * as moment from 'moment';
import {IEntry} from '../model/model';

class EntryListComponentController implements ng.IController {
	filter = {
		from    : null,
		to      : null,
		todate  : null,
		fromdate: null,
		value   : '',
		contact : '',
		text    : '',
		type    : '',
	};
	sorting = {
		sort: 'day',
		asc : true,
	};
	balance: number;
	list: Array<IEntry> = [];
	entries: Array<IEntry>;

	static $inject = ['$scope', '$log'];

	constructor(private $scope: angular.IScope, private $log: angular.ILogService) {
	}

	$onInit(): void {
		this.$log.debug('init EntryListCompontentController');
		this.$scope.$watch('$ctrl.list', (list) => {
			if (list) {
				this.doFilter();
			}
		});
		/*
		 $scope.$watch('filter.from', function (val) {$scope.filter.fromdate = val ? moment(val, 'YYYY/MM/DD').valueOf() : null;doFilter();});
		 $scope.$watch('filter.to', function (val) {$scope.filter.todate = val ? moment(val, 'YYYY/MM/DD').valueOf() : null;doFilter();});
		 $scope.$watch('filter.type', doFilter);
		 $scope.$watch('filter.text', doFilter);
		 $scope.$watch('filter.contact', doFilter);
		 $scope.$watch('filter.value', doFilter);
		 */
	}

	doFilter() {
		let balance = 0;
		this.entries = this.list.filter((e) => {
			if ((this.filter.todate && (this.filter.todate < e.day)) ||
				(this.filter.fromdate && (this.filter.fromdate > e.day)) ||
				(this.filter.type && (e.type.indexOf(this.filter.type) < 0)) ||
				(this.filter.contact && (e.contact_name.indexOf(this.filter.contact) < 0)) ||
				(this.filter.text && (e.text.indexOf(this.filter.text) < 0))) {
				return false;
			}
			balance += e.value;
			return true;
		});
		this.balance = balance;
		this.doSort();
	};

	doSort() {
		this.entries.sort((a, b) => {
			let ac = a[this.sorting.sort];
			let bc = b[this.sorting.sort];
			if (ac < bc) {
				return this.sorting.asc ? 1 : -1;
			}
			if (ac > bc) {
				return this.sorting.asc ? -1 : 1;
			}
			return 0;
		});
	};

	doToggleSort(sort) {
		if (this.sorting.sort == sort) {
			this.sorting.asc = !this.sorting.asc;
		} else {
			this.sorting.sort = sort;
		}
		this.doSort();
	}

	display() {
		let view = {
			total    : 0,
			min      : null,
			max      : null,
			datestats: new AccountStats(),
			entries  : this.list,
		};
		this.list.forEach(function (entry) {
			let day = moment(entry.day, 'YYYY/MM/DD').valueOf();
			if (view.min == null || view.min > day) {
				view.min = day;
			}
			if (view.max == null || view.max < day) {
				view.max = day;
			}
			view.datestats.register(entry);
			view.total += entry.value;
		});
	}

}

class EntryListComponent implements ng.IComponentOptions {

	public bindings: any;
	public controller: any;
	public template: string;

	constructor() {
		this.bindings = {
			list: '<',
		};
		this.controller = EntryListComponentController;
		this.template = require('./entrylist.template.html');
	}

}

export {EntryListComponent}
