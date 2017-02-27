import {IEntryFields, IInvoiceFields} from '../../../../app/src/app/model/model';
import {IFormatSpec, IReaderFormat} from '../reader.interface';

const dkb2017: IFormatSpec = {
	name: 'dkb2017-girokonto',
	encoding: 'iso-8859-1',
	linefeed: '\n',
	header: [
		{
			multi: {
				seperator: ';',
				items: [
					{constant: {text: 'Kontonummer:'}},
					{
						multi: {
							seperator: '/',
							items: [
								{value: {field: IInvoiceFields.account_nr}},
								{constant: {text: 'Girokonto'}}
							]
						}
					}
				]
			}
		},
		{
			multi: {
				seperator: ';',
				items: [
					{constant: {text: 'Von:'}},
					{date: {field: IInvoiceFields.date_from, date_format: 'DD.MM.YYYY'}}
				]
			}
		},
		{
			multi: {
				seperator: ';',
				items: [
					{constant: {text: 'Bis:'}},
					{date: {field: IInvoiceFields.date_until, date_format: 'DD.MM.YYYY'}}
				]
			}
		},
		{
			multi: {
				seperator: ';',
				items: [
					{constant: {text: 'Kontostand vom:'}},
					{value: {field: IInvoiceFields.balance}}
				]
			}
		},
		{
			multi: {
				seperator: ';',
				items: [
					{constant: {text: 'Buchungstag'}},
					{constant: {text: 'Wertstellung'}},
					{constant: {text: 'Buchungstext'}},
					{constant: {text: 'Auftraggeber / Begünstigter'}},
					{constant: {text: 'Verwendungszweck'}},
					{constant: {text: 'Kontonummer'}},
					{constant: {text: 'BLZ'}},
					{constant: {text: 'Betrag (EUR)'}},
					{constant: {text: 'Gläubiger-ID'}},
					{constant: {text: 'Mandatsreferenz'}},
					{constant: {text: 'Kundenreferenz'}}
				]
			}
		}
	],
	entries: {
		multi: {
			seperator: ';',
			items: [
				{date: {field: IEntryFields.day, date_format: 'DD.MM.YYYY'}},
				{date: {field: IEntryFields.valuta, date_format: 'DD.MM.YYYY'}},
				{value: {field: IEntryFields.type}},
				{value: {field: IEntryFields.contact_name}},
				{value: {field: IEntryFields.text}},
				{value: {field: IEntryFields.contact_nr}},
				{value: {field: IEntryFields.contact_blz}},
				{float: {field: IEntryFields.value, float_delimiter: ','}},
				{value: {field: IEntryFields.gl_id}},
				{value: {field: IEntryFields.mandat_ref}},
				{value: {field: IEntryFields.kdn_ref}}
			]
		}
	}
};

const DKBSpecs: IReaderFormat = {
	bank: 'DKB',
	specs: [dkb2017]
};

export {DKBSpecs}
