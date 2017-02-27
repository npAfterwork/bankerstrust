
class Routes {
	static get Dashboard() { return 'dashboard'; }
	static get Account() { return 'account'; }
	static get AccountList() { return 'account.list'; }
	static get AccountImport() { return 'account.import'; }
	static get Contacts() { return 'contacts'; }
}

class AngularServices {
	static get Q() { return '$q'; }
	static get Http() { return '$http'; }
	static get State() { return '$state'; }
	static get StateParams() { return '$stateParams'; }
	static get Scope() { return '$scope'; }
	static get RootScope() { return '$rootScope'; }
	static get Location() { return '$location'; }
	static get HotKeys() { return 'hotkeys'; }
}

export {Routes, AngularServices}
