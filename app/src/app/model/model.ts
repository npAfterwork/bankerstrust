interface IContact {
	key: string;
	value: string;
}

interface IAccount {
	name: string;
	id: string;
	iban?: string;
	account_nr?: string;
	blz?: string;
	notes?: string;
	bank?: string;
	user?: string;
}

interface IAccountInfo {
	account: IAccount;
	entries_count: number;
}

const IEntryFields = {
	raw: 'raw',
	day: 'day',
	valuta: 'valuta',
	value: 'value',
	text: 'text',
	type: 'type',
	contact_name: 'contact_name',
	contact_nr: 'contact_nr',
	contact_blz: 'contact_blz',
	card_nr: 'card_nr',
	atm_nr: 'atm_nr',
	atm_blz: 'atm_blz',
	ref: 'ref',
	gl_id: 'gl_id',
	endtoend_ref: 'mandat_ref',
	mandat_ref: 'mandat_ref',
	kdn_ref: 'kdn_ref',
	onb_ref: 'onb_ref'
};

const IInvoiceFields = {
	user: 'user',
	account_nr: 'account_nr',
	balance: 'balance',
	date: 'date',
	date_from: 'date_from',
	date_until: 'date_until',
	blz: 'blz',
};

interface IInvoice {
	format: string;
	user: string;
	account_nr: string;
	blz: string;
	balance: string;
	date: string;
	date_from: string;
	date_until: string;
	entries: Array<IEntry>;
}

interface IEntry {
	raw: string;
	day: string;
	valuta: string;
	value: number;
	text: string;
	type: string;
	contact_name: string;
	contact_nr?: string;
	contact_blz?: string;
	card_nr?: string;
	atm_nr?: string;
	atm_blz?: string;
	ref?: string;
	kdn_ref?: string;
	onb_ref?: string;
	mandat_ref?: string;
	endtoend_ref?: string;
	gl_id?: string;
}

export {IAccount, IAccountInfo, IEntry, IEntryFields, IInvoice, IContact, IInvoiceFields};
