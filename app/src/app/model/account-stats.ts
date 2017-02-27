import * as moment from 'moment';

class AccountStats {
	id: string;
	childs: Array<any> = [];
	entries: Array<any> = [];

	count() {
		let result = this.entries.length;
		this.childs.forEach(c => {
			result += c.count();
		});
		return result;
	}

	aggregate(agg) {
		let result = 0;
		this.entries.forEach(e => {
			result += agg(e);
		});
		this.childs.forEach(c => {
			result += c.aggregate(agg);
		});
		return result;
	}

	public register(entry) {

		let findOrCreate = (id, current, node, sorter) => {
			let child = node.childs.filter(c => (c.id == id))[0];
			if (!child) {
				child = new AccountStats();
				child.id = id;
				node.childs.push(child);
			}
			sorter(current, child);
			return child;
		};

		let addsorter = (current, node) => {
			node.entries.push(current);
		};

		let daysorter = (current, node) => {
			findOrCreate(moment(current.day, 'YYYY/MM/DD').date(), current, node, addsorter);
		};

		let monthsorter = (current, node) => {
			findOrCreate(moment(current.day, 'YYYY/MM/DD').month(), current, node, daysorter);
		};

		let yearsorter = (current, node) => {
			findOrCreate(moment(current.day, 'YYYY/MM/DD').year(), current, node, monthsorter);
		};

		yearsorter(entry, this);

	}

}

export {AccountStats};
