import {IEntry, IInvoice} from '../../../app/src/app/model/model';

export interface IFormatSpecValueItemValue {
	field: string;
	removespace?: Array<number>;
}

export interface IFormatSpecValueItemRegex {
	regex: string;
	field: string;
}

export interface IFormatSpecValueItemDate {
	date_format?: string;
	field: string;
}

export interface IFormatSpecValueItemEnum {
	enums?: Array<string>;
	field: string;
}

export interface IFormatSpecValueItemEnumConstant {
	enums?: Array<string>;
}

export interface IFormatSpecValueItemFloat {
	float_delimiter?: string;
	field: string;
}

export interface IFormatSpecValueItemConstant {
	text: string;
}

export interface IFormatSpecValueItemMulti {
	seperator?: string;
	items?: Array<IFormatSpecValueItem>;
}

export interface IFormatSpecValueItemMultiRegex {
	regex: string;
	removespace?: Array<number>;
	items: Array<IFormatSpecValueItem>;
}

export interface IFormatSpecValueItemMultiOr {
	items: Array<IFormatSpecValueItem>;
}

export interface IFormatSpecFixedValueItem {
	field: string;
	fixed: string;
}

export interface IFormatSpecValueItem {
	constant?: IFormatSpecValueItemConstant;
	multi?: IFormatSpecValueItemMulti;
	or?: IFormatSpecValueItemMultiOr;
	float?: IFormatSpecValueItemFloat;
	enums_constant?: IFormatSpecValueItemEnumConstant;
	enums?: IFormatSpecValueItemEnum;
	date?: IFormatSpecValueItemDate;
	regex?: IFormatSpecValueItemRegex;
	regex_multi?: IFormatSpecValueItemMultiRegex;
	value?: IFormatSpecValueItemValue;
	ignore?: boolean;
	fixed?: Array<IFormatSpecFixedValueItem>;
}

export interface IFormatSpec {
	name: string;
	encoding: string;
	linefeed: string;
	header: Array<IFormatSpecValueItem>;
	entries: IFormatSpecValueItem;
	footer?: Array<IFormatSpecValueItem>;
	transform?: (data: IEntry) => IEntry;
}

export interface IReaderResult {
	invoice?: IInvoice;
	error?: string;
	details?: any;
}

export interface IReaderFormat {
	bank: string;
	specs: Array<IFormatSpec>;
}
