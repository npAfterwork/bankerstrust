'use strict';

const path = require("path");

module.exports = {
	entry: [path.join(__dirname, "src", "backend.ts")],
	target: 'node',
	output: {
		path: path.resolve(__dirname, "..", "dist"),
		publicPath: "/",
		libraryTarget: 'commonjs2',
		filename: 'server.js'
	},
	externals: [
		/^[a-z\-0-9]+$/ // Ignore node_modules folder
	],
	cache: true,
	devtool: 'source-map',
	resolve: {
		extensions: ['*', '.webpack.js', '.web.js', '.ts', '.js']
	},
	module: {
		loaders: [
			{test: /\.ts$/, enforce: 'pre', loader: 'tslint-loader'},
			{test: /\.ts$/, exclude: __dirname + '/node_modules', loader: 'awesome-typescript-loader'}
		]
	},
	node: {
		global: true,
		crypto: true,
		__dirname: true,
		__filename: true,
		process: true,
		Buffer: true
	}
};
