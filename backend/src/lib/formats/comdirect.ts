import {IEntry, IEntryFields, IInvoiceFields} from '../../../../app/src/app/model/model';
import {IReaderFormat, IFormatSpec} from '../reader.interface';

const comdirect_girokonto_2005_2010: IFormatSpec = {
	name: 'comdirect girokonto 2005-2009',
	encoding: 'iso-8859-1',
	linefeed: '\n',
	header: [
		{constant: {text: 'comdirect bank AG'}},
		{
			multi: {
				seperator: ';',
				items: [
					{
						multi: {
							seperator: ':',
							items: [
								{constant: {text: 'UMSÄTZE'}},
								{value: {field: IInvoiceFields.user}}
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
					{constant: {text: 'Kunden-Nummer:'}},
					{value: {field: IInvoiceFields.account_nr}}
				]
			}
		},
		{
			multi: {
				seperator: ';',
				items: [
					{constant: {text: 'BLZ:'}},
					{value: {field: IInvoiceFields.blz}}
				]
			}
		},
		{
			multi: {
				seperator: ';',
				items: [
					{constant: {text: 'Umsätze Girokonto'}},
					{
						multi: {
							seperator: ':',
							items: [
								{constant: {text: '- Zeitraum'}},
								{value: {field: IInvoiceFields.date}}
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
					{constant: {text: 'Buchungstag'}},
					{constant: {text: 'Valuta'}},
					{constant: {text: 'Vorgang'}},
					{constant: {text: 'Buchungstext'}},
					{constant: {text: 'Umsatz in EUR'}}
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
				{
					or: {
						items: [
							{
								regex_multi: {
									regex: 'Auftraggeber:(.*)Buchungstext:(.*) ONB-REF ([0-9]*) BLZ ([0-9]*)',
									items: [
										{value: {field: IEntryFields.contact_name, removespace: [27]}},
										{value: {field: IEntryFields.text}},
										{value: {field: IEntryFields.onb_ref}},
										{value: {field: IEntryFields.contact_blz}},
									]
								}
							},
							{
								regex_multi: {
									regex: 'Auftraggeber:(.*)Buchungstext:(.*) KDN-REF ([0-9]*) ONB-REF ([0-9]*) BLZ ([0-9]*)',
									items: [
										{value: {field: IEntryFields.contact_name, removespace: [27]}},
										{value: {field: IEntryFields.text}},
										{value: {field: IEntryFields.onb_ref}},
										{value: {field: IEntryFields.contact_blz}},
									]
								}
							},
							{
								regex_multi: {
									regex: 'Auftraggeber:(.*)Buchungstext:(.*) KDN-REF ([0-9]*)',
									items: [
										{value: {field: IEntryFields.contact_name, removespace: [27]}},
										{value: {field: IEntryFields.text, removespace: [42, 51, 93]}},
										{value: {field: IEntryFields.kdn_ref}},
									]
								}
							},
							{
								regex_multi: {
									regex: 'Auftraggeber:(.*)Buchungstext:(.*)',
									items: [
										{value: {field: IEntryFields.contact_name, removespace: [27]}},
										{value: {field: IEntryFields.text, removespace: [42, 51, 54, 93]}}
									]
								}
							},
							{
								regex_multi: {
									regex: 'Empfänger:(.*)Buchungstext:(.*)',
									items: [
										{value: {field: IEntryFields.contact_name, removespace: [27]}},
										{value: {field: IEntryFields.text, removespace: [42, 51, 93]}}
									]
								}
							},
							{
								regex_multi: {

									regex: 'GA NR([0-9]*) BLZ([0-9]*) (.*)',
									removespace: [27],
									items: [
										{value: {field: IEntryFields.contact_nr}},
										{value: {field: IEntryFields.contact_blz}},
										{value: {field: IEntryFields.text}}
									]
								},
								fixed: [
									{field: IEntryFields.contact_name, fixed: 'Bargeld'}
								]
							},
							{
								regex_multi: {

									regex: 'Buchungstext: GA NR([0-9]*) BLZ([0-9]*) (.*) Ref\. (.*)',
									removespace: [39],
									items: [
										{value: {field: IEntryFields.contact_nr}},
										{value: {field: IEntryFields.contact_blz}},
										{value: {field: IEntryFields.text}},
										{value: {field: IEntryFields.ref}}
									]
								},
								fixed: [
									{field: IEntryFields.contact_name, fixed: 'Bargeld'}
								]
							},
							{
								regex_multi: {
									regex: 'EC-GA (.*)',
									items: [
										{value: {field: IEntryFields.text}}
									]
								},
								fixed: [
									{field: IEntryFields.contact_name, fixed: 'Bargeld'}
								]
							},
							{
								regex_multi: {
									regex: '(.*) CD-UEB AN([0-9]*)-BLZ([0-9]*) (.*)[0-9][0-9][0-9]',
									items: [
										{value: {field: IEntryFields.contact_name}},
										{value: {field: IEntryFields.contact_nr}},
										{value: {field: IEntryFields.contact_blz}},
										{value: {field: IEntryFields.text}}
									]
								}
							},
							{
								regex_multi: {
									regex: 'VISA-KARTE NR. ([0-9]*) (.*)',
									items: [
										{value: {field: IEntryFields.card_nr}},
										{value: {field: IEntryFields.text}}
									]
								},
								fixed: [
									{field: IEntryFields.contact_name, fixed: 'VISA'}
								]
							},
							{
								regex_multi: {
									regex: 'Abschluss (.*)',
									items: [
										{value: {field: IEntryFields.text}}
									]
								},
								fixed: [
									{field: IEntryFields.contact_name, fixed: 'comdirect'}
								]
							},
							{
								regex_multi: {
									regex: 'Gutschriften (.*)',
									items: [
										{value: {field: IEntryFields.text}}
									]
								},
								fixed: [
									{field: IEntryFields.contact_name, fixed: 'comdirect'}
								]
							},
							{
								regex_multi: {
									regex: 'Buchungstext: (.*) Ref\. (.*)',
									items: [
										{value: {field: IEntryFields.text}},
										{value: {field: IEntryFields.ref}}
									]
								}
							}
						]
					}
				},
				{float: {field: IEntryFields.value, float_delimiter: ','}}
			]
		}
	},
	transform: (entry: IEntry) => {
		if (entry.text.indexOf(entry.contact_name) == 0) {
			entry.text = entry.text.slice(entry.contact_name.length).trim();
		}
		return entry;
	}
};

const comdirect_girokonto_2011_2012: IFormatSpec = {
	name: 'comdirect girokonto 2011-2012',
	encoding: 'iso-8859-1',
	linefeed: '\n',
	header: [
		{constant: {text: 'comdirect bank AG'}},
		{
			multi: {
				seperator: ';',
				items: [
					{
						multi: {
							seperator: ':',
							items: [
								{constant: {text: 'UMSÄTZE'}},
								{value: {field: IInvoiceFields.user}}
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
					{constant: {text: 'Kunden-Nummer:'}},
					{value: {field: IInvoiceFields.account_nr}}
				]
			}
		},
		{
			multi: {
				seperator: ';',
				items: [
					{constant: {text: 'BLZ:'}},
					{value: {field: IInvoiceFields.blz}}
				]
			}
		},
		{
			multi: {
				seperator: ';',
				items: [
					{constant: {text: 'Umsätze Girokonto'}},
					{
						multi: {
							seperator: ':',
							items: [
								{constant: {text: '- Zeitraum'}},
								{value: {field: IInvoiceFields.date}}
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
					{constant: {text: 'Buchungstag'}},
					{constant: {text: 'Wertstellung (Valuta)'}},
					{constant: {text: 'Vorgang'}},
					{constant: {text: 'Buchungstext'}},
					{constant: {text: 'Umsatz in EUR'}}
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
				{
					or: {
						items: [
							{
								regex_multi: {

									regex: 'Buchungstext: GA NR([0-9]*) BLZ([0-9]*) (.*) Ref\. (.*)',
									removespace: [39],
									items: [
										{value: {field: IEntryFields.contact_nr}},
										{value: {field: IEntryFields.contact_blz}},
										{value: {field: IEntryFields.text}},
										{value: {field: IEntryFields.ref}}
									]
								},
								fixed: [
									{field: IEntryFields.contact_name, fixed: 'Bargeld'}
								]
							},
							{
								regex_multi: {

									regex: 'Buchungstext: GA NR([0-9]*) BLZ([0-9]*) (.*)',
									removespace: [39],
									items: [
										{value: {field: IEntryFields.contact_nr}},
										{value: {field: IEntryFields.contact_blz}},
										{value: {field: IEntryFields.text}}
									]
								},
								fixed: [
									{field: IEntryFields.contact_name, fixed: 'Bargeld'}
								]
							},
							{
								regex_multi: {
									regex: 'Auftraggeber:(.*)Buchungstext:(.*) KDN-REF ([0-9]*) Ref\.(.*)',
									items: [
										{value: {field: IEntryFields.contact_name, removespace: [27]}},
										{value: {field: IEntryFields.text, removespace: [51, 92]}},
										{value: {field: IEntryFields.kdn_ref}},
										{value: {field: IEntryFields.ref}}
									]
								}
							},
							{
								regex_multi: {
									regex: 'Empfänger:(.*)Kto/IBAN:(.*)BLZ/BIC:(.*)Buchungstext:(.*) Ref\. (.*)',
									items: [
										{value: {field: IEntryFields.contact_name, removespace: [27]}},
										{value: {field: IEntryFields.contact_nr}},
										{value: {field: IEntryFields.contact_blz}},
										{value: {field: IEntryFields.text, removespace: [27]}},
										{value: {field: IEntryFields.ref}}
									]
								}
							},
							{
								regex_multi: {
									regex: 'Buchungstext:(.*) Ref\. (.*)',
									items: [
										{value: {field: IEntryFields.text, removespace: [27, 51, 92]}},
										{value: {field: IEntryFields.ref}}
									]
								}
							}
						]
					}
				},
				{float: {field: IEntryFields.value, float_delimiter: ','}}
			]
		}
	}
};

const comdirect_girokonto_2013_2017: IFormatSpec = {
	name: 'comdirect girokonto 2013-2015',
	encoding: 'iso-8859-1',
	linefeed: '\n',
	header: [
		{constant: {text: 'comdirect bank AG'}},
		{
			multi: {
				seperator: ';',
				items: [
					{
						multi: {
							seperator: ':',
							items: [
								{constant: {text: 'Umsätze'}},
								{value: {field: IInvoiceFields.user}}
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
					{constant: {text: 'Kundennummer:'}},
					{value: {field: IInvoiceFields.account_nr}}
				]
			}
		},
		{
			multi: {
				seperator: ';',
				items: [
					{constant: {text: 'BLZ:'}},
					{value: {field: IInvoiceFields.blz}}
				]
			}
		},
		{
			multi: {
				seperator: ';',
				items: [
					{constant: {text: 'Umsätze Girokonto'}},
					{
						multi: {
							seperator: ':',
							items: [
								{constant: {text: 'Zeitraum'}},
								{value: {field: IInvoiceFields.date}}
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
					{constant: {text: 'Buchungstag'}},
					{constant: {text: 'Wertstellung (Valuta)'}},
					{constant: {text: 'Vorgang'}},
					{constant: {text: 'Buchungstext'}},
					{constant: {text: 'Umsatz in EUR'}}
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
				{
					or: {
						items: [
							{
								regex_multi: {

									regex: 'Buchungstext: GA NR([0-9]*) BLZ([0-9]*) (.*) Ref\. (.*)',
									removespace: [39],
									items: [
										{value: {field: IEntryFields.contact_nr}},
										{value: {field: IEntryFields.contact_blz}},
										{value: {field: IEntryFields.text}},
										{value: {field: IEntryFields.ref}}
									]
								},
								fixed: [
									{field: IEntryFields.contact_name, fixed: 'Bargeld'}
								]
							},
							{
								regex_multi: {
									regex: 'Auftraggeber:(.*)Buchungstext:(.*) End-to-End-Ref\.: (.*) Ref\.(.*)',
									items: [
										{value: {field: IEntryFields.contact_name, removespace: [35]}},
										{value: {field: IEntryFields.text, removespace: [71]}},
										{value: {field: IEntryFields.kdn_ref}},
										{value: {field: IEntryFields.ref}}
									]
								}
							},
							{
								regex_multi: {
									regex: 'Auftraggeber:(.*)Buchungstext:(.*) KDN-REF ([0-9]*) Ref\.(.*)',
									items: [
										{value: {field: IEntryFields.contact_name, removespace: []}},
										{value: {field: IEntryFields.text, removespace: []}},
										{value: {field: IEntryFields.kdn_ref}},
										{value: {field: IEntryFields.ref}}
									]
								}
							},
							{
								regex_multi: {
									regex: 'Auftraggeber:(.*)Buchungstext:(.*) Ref\. (.*)',
									items: [
										{value: {field: IEntryFields.contact_name, removespace: []}},
										{value: {field: IEntryFields.text, removespace: []}},
										{value: {field: IEntryFields.ref}}
									]
								}
							},
							{
								regex_multi: {
									regex: 'Empfänger:(.*)Kto/IBAN:(.*)BLZ/BIC:(.*)Buchungstext:(.*) End-to-End-Ref\.:(.*)/ Mandatsref\.:(.*)Gläubiger-ID:(.*)Ref\.(.*)',
									items: [
										{value: {field: IEntryFields.contact_name, removespace: [35]}},
										{value: {field: IEntryFields.contact_nr}},
										{value: {field: IEntryFields.contact_blz}},
										{value: {field: IEntryFields.text, removespace: [34, 35]}},
										{value: {field: IEntryFields.endtoend_ref}},
										{value: {field: IEntryFields.gl_id}},
										{value: {field: IEntryFields.ref}}
									]
								}
							},
							{
								regex_multi: {
									regex: 'Empfänger:(.*)Kto/IBAN:(.*)BLZ/BIC:(.*)Buchungstext:(.*) End-to-End-Ref\.: (.*) Ref\. (.*)',
									items: [
										{value: {field: IEntryFields.contact_name, removespace: [35]}},
										{value: {field: IEntryFields.contact_nr}},
										{value: {field: IEntryFields.contact_blz}},
										{value: {field: IEntryFields.text, removespace: [34, 35]}},
										{value: {field: IEntryFields.ref}}
									]
								}
							},
							{
								regex_multi: {
									regex: 'Empfänger:(.*)Kto/IBAN:(.*)BLZ/BIC:(.*)Buchungstext:(.*) Ref\. (.*)',
									items: [
										{value: {field: IEntryFields.contact_name, removespace: []}},
										{value: {field: IEntryFields.contact_nr}},
										{value: {field: IEntryFields.contact_blz}},
										{value: {field: IEntryFields.text, removespace: []}},
										{value: {field: IEntryFields.ref}}
									]
								}
							},
							{
								regex_multi: {
									regex: 'Empfänger:(.*)Kto/IBAN:(.*)BLZ/BIC:(.*)Buchungstext:(.*) KDN-REF (.*)',
									items: [
										{value: {field: IEntryFields.contact_name, removespace: []}},
										{value: {field: IEntryFields.contact_nr}},
										{value: {field: IEntryFields.contact_blz}},
										{value: {field: IEntryFields.text, removespace: []}},
										{value: {field: IEntryFields.kdn_ref}}
									]
								}
							},
							{
								regex_multi: {
									regex: 'Buchungstext:(.*) Ref\. (.*)',
									items: [
										{value: {field: IEntryFields.text, removespace: []}},
										{value: {field: IEntryFields.ref}}
									]
								}
							}
						]
					}
				},
				{float: {field: IEntryFields.value, float_delimiter: ','}}
			]
		}
	}
};

const ComdirectSpecs: IReaderFormat = {
	bank: 'comdirect',
	specs: [comdirect_girokonto_2013_2017, comdirect_girokonto_2011_2012, comdirect_girokonto_2005_2010]
};

export {ComdirectSpecs}
