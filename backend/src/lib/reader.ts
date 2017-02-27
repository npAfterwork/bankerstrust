import {Utils} from './utils';
import * as fs from 'fs';
import * as moment from 'moment';
import * as iconv from 'iconv-lite';
import {IReaderFormat, IFormatSpecValueItem, IReaderResult, IFormatSpec} from './reader.interface';
import {IEntry, IInvoice} from '../../../app/src/app/model/model';
import {ComdirectSpecs} from './formats/comdirect';
import {DKBSpecs} from './formats/dkb';

const ReaderFormats: Array<IReaderFormat> = [
	ComdirectSpecs,
	DKBSpecs
];

class Reader {

	readSpec(text: string, spec: IFormatSpecValueItem, dest: Object) {

		let applyFixed = () => {
			if (spec.fixed) {
				spec.fixed.forEach((f) => {
					dest[f.field] = f.fixed;
				});
			}
			return null;
		};


		if (spec.ignore) {
			return applyFixed();
		} else if (spec.constant) {
			if (spec.constant.text == Utils.removeQuotes(text)) {
				return applyFixed();
			}
			return 'static spec, should: ' + spec.constant.text + ' is ' + text;
		} else if (spec.float) {
			let f = parseFloat(text.replace('.', '').replace(spec.float.float_delimiter, '.'));
			if (isNaN(f)) {
				return 'invalid entry float field val: ' + text;
			}
			dest[spec.float.field] = f;
			return applyFixed();
		} else if (spec.enums_constant) {
			if (spec.enums.enums.indexOf(text) < 0) {
				return 'unknown constant enum field val: ' + text;
			}
			return applyFixed();
		} else if (spec.enums) {
			if (spec.enums.enums.indexOf(text) < 0) {
				return 'unknown entry enum field val: ' + text;
			}
			dest[spec.enums.field] = text;
			return applyFixed();
		} else if (spec.date) {
			let d = moment.utc(text, spec.date.date_format);
			if (!d.isValid()) {
				return 'invalid entry date field val: ' + text;
			}
			dest[spec.date.field] = d.format('YYYY/MM/DD');
			return applyFixed();
		} else if (spec.regex) {
			let regex = new RegExp(spec.regex.regex);
			let r = text.match(regex);
			if (!r) {
				return 'no regex match header spec, should: ' + spec.regex.regex + ' is ' + text;
			}
			dest[spec.regex.field] = r[1];
			return applyFixed();
		} else if (spec.regex_multi) {
			let s = Utils.removeQuotes(text).trim();
			if (spec.regex_multi.removespace) {
				let r = spec.regex_multi.removespace;
				for (let i = r.length - 1; i >= 0; i--) {
					let rs = r[i];
					if (s[rs] == ' ') {
						s = s.slice(0, rs) + s.slice(rs + 1);
					}
				}
			}
			let regex = new RegExp(spec.regex_multi.regex);
			let r = s.match(regex);
			if (!r) {
				return 'no regex match header spec, should: ' + spec.regex_multi.regex + ' is ' + text;
			}
			for (let i = 0; i < spec.regex_multi.items.length; i++) {
				if (r[i + 1] == null) {
					return 'missing column text for regex field spec ' + JSON.stringify(spec.regex_multi.items[i]);
				}
				let err = this.readSpec(r[i + 1], spec.regex_multi.items[i], dest);
				if (err) {
					return err;
				}
			}
			return applyFixed();
		} else if (spec.multi) {
			if (spec.multi.seperator && spec.multi.items) {
				let cols = text.split(spec.multi.seperator); // TODO: split with check if quoted
				for (let i = 0; i < spec.multi.items.length; i++) {
					if (cols[i] == null) {
						return 'missing column text for spec ' + JSON.stringify(spec.multi.items[i]);
					}
					let val = Utils.removeQuotes(cols[i]);
					let err = this.readSpec(val, spec.multi.items[i], dest);
					if (err) {
						return err;
					}
				}
				return applyFixed();
			}
			return 'invalid spec, unknown multi' + JSON.stringify(spec);
		} else if (spec.or) {
			for (let j = 0; j < spec.or.items.length; j++) {
				let err = this.readSpec(text, spec.or.items[j], {});
				if (!err) {
					this.readSpec(text, spec.or.items[j], dest);
					return applyFixed();
				}
			}
			return 'all "or" entries field spec failed ' + text;
		} else if (spec.value) {
			let s = Utils.removeQuotes(text).trim();
			if (spec.value.removespace) {
				let r = spec.value.removespace;
				for (let i = r.length - 1; i >= 0; i--) {
					let rs = r[i];
					if (s[rs] == ' ') {
						s = s.slice(0, rs) + s.slice(rs + 1);
					}
				}
			}
			dest[spec.value.field] = s;
			return applyFixed();
		}
		return 'invalid spec, unknown ' + JSON.stringify(spec);
	}

	readLines(lines: Array<string>, start: number, format: IFormatSpec, cb: (err?: any, invoice?: IInvoice, line?: number) => void) {
		let invoice = {entries: [], format: format.name};
		let header = 0;
		let footer = 0;
		for (let i = start; i < lines.length; i++) {
			let line = lines[i].trim();
			if (line.length == 0) {
				continue;
			}
			if (header < format.header.length) {
				let h = format.header[header];
				let err = this.readSpec(line, h, invoice);
				if (err) {
					return cb('error on header line ' + i + ': ' + err);
				}
				header++;
			} else if (footer > 0) {
				if (footer >= format.footer.length) {
					return cb(null, invoice, i);
				}
				let f = format.footer[footer];
				let err = this.readSpec(line, f, invoice);
				if (err) {
					return cb('error on footer line ' + i + ': ' + err);
				}
				footer++;
			} else {
				let entry: IEntry = {
					raw: line,
					day: '',
					valuta: '',
					value: 0,
					text: '',
					type: '',
					contact_name: ''
				};
				let err = this.readSpec(line, format.entries, entry);
				if (err) {
					if (format.footer) {
						let f = format.footer[0];
						let e = this.readSpec(line, f, invoice);
						if (!e) {
							footer++;
							continue;
						}
					}
					return cb('error on entry line ' + i + ': ' + err);
				}
				invoice.entries.push(format.transform ? format.transform(entry) : entry);
			}
		}
		cb(null, invoice, lines.length);
	}


	read(data: Buffer, format: IFormatSpec, cb) {
		let s = iconv.decode(data, format.encoding);
		let lines = s.split(format.linefeed);
		this.readLines(lines, 0, format, (err, invoice, linenr) => {
			if (err) {
				return cb(err);
			}
			if (linenr < lines.length) {
				console.log('TODO: More lines availble');
			}
			cb(null, invoice);
		});
		// if (s.indexOf('Ã¤') > 0) {
		// 	s = iconv.decode(data, 'utf-8').toString();
		// 	console.log('WARNING file format converted', filename);
		// }
	}

	readFile(filename: string, bank: string, cb: (err: any, data?: IReaderResult) => void) {
		fs.readFile(filename, (err, data) => {
			if (err) {
				return cb(err);
			}
			this.readBuffer(data, bank, cb);
		});
	}

	readBuffer(data: Buffer, bank: string, cb: (err: any, data?: IReaderResult) => void) {
		let format = ReaderFormats.filter(f => f.bank == bank)[0];
		if (!format) {
			format = ReaderFormats[0];
		}
		let errors = {};
		Utils.queue(format.specs, (spec, next) => {
			this.read(data, spec, (e, invoice) => {
				if (e) {
					errors[spec.name] = e;
					return next();
				}
				cb(null, {invoice: invoice});
			});
		}, () => {
			cb(null, {error: 'no format worked', details: errors});
		});
	}
}

export {Reader, ReaderFormats}
