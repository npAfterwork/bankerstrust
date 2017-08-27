import {Reader} from '../src/lib/reader';
import * as path from 'path';

let filename = path.resolve('..', 'data', 'test.csv');
// let bank = 'DKB';
let bank = 'comdirect';

let reader = new Reader();

reader.readFile(filename, bank, (err, result) => {
	if (err) {
		console.log(err);
	}
	if (result.error) {
		return console.log(JSON.stringify(result, null, '\t'));
	}
	// console.log(JSON.stringify(result.invoice.entries.map(e => e.text), null, '\t'));
	// console.log(JSON.stringify(result.invoice.entries.map(e => ({text: e.text, raw: e.raw})), null, '\t'));
	console.log(JSON.stringify(result, null, '\t'));
});
