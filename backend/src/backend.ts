import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';
import {Base} from './lib/base';
const fileUpload = require('express-fileupload');

const app = express();

let config = JSON.parse(fs.readFileSync('config.json').toString());

app.use(fileUpload({
	limits: {fileSize: 50 * 1024 * 1024}
}));

const base = new Base(config);

app.use('/', express.static(path.resolve(config.paths.web)));

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

app.get('/api/accounts/list', (req, res) => {
	res.json(base.accounts.infos());
});

app.post('/api/accounts/new', (req, res) => {
	console.log(req.body);
	base.accounts.newAccount(req.body, (err, account) => {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		}
		res.json(account.info());
	});
});

app.post('/api/accounts/update', (req, res) => {
	if (!req.body || !req.body.id) {
		return res.sendStatus(404);
	}
	base.accounts.updateAccount(req.body, (err, account) => {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		}
		res.json(account.info());
	});
});

app.post('/api/accounts/delete', (req, res) => {
	if (!req.body || !req.body.id) {
		return res.sendStatus(404);
	}
	base.accounts.deleteAccount(req.body, (err, account) => {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		}
		res.json(account.info());
	});
});

app.get('/api/account/:id/id', (req, res) => {
	let account = base.accounts.get(req.params.id);
	if (!account) {
		return res.sendStatus(404);
	}
	res.json(account.info());
});

app.get('/api/account/:id/entries', (req, res) => {
	let account = base.accounts.get(req.params.id);
	if (!account) {
		return res.sendStatus(404);
	}
	res.json(account.entries);
});

app.post('/api/account/:id/import', (req, res) => {
	if (!req.params || !req.params.id || !req['files'] || !req['files'].file || !req['files'].file.data) {
		return res.sendStatus(404);
	}
	base.accounts.importData(req.params.id, req['files'].file.data, !!req.body['apply'], (err, result) => {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		}
		res.json([result]);
	});
});

app.get('/api/contacts.json', (req, res) => {
	res.json(base.contacts.json());
});

app.get('/api/contacts.change', (req, res) => {
	base.contacts.change(req.query.key, req.query.val, err => {
		res.sendStatus(err ? 400 : 200);
	});
});

base.init((err) => {
	if (err) {
		return console.log(err);
	}
	console.log('backend started http://' + config.server.host + ':' + config.server.port);
	app.listen(config.server.port);
});

