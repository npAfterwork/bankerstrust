'use strict';

const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require("../dist/config.json");
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const conf = {
	webpack: {
		analyze: false,
		minimize: true,
		debug: false,
		sourcemaps: false
	}
};

const dist_folder = path.resolve(__dirname, "..", "dist", "app");

module.exports = {
	devtool: conf.webpack.sourcemaps ? 'source-map' : undefined,
	entry: [path.join(__dirname, "src", "index.js")],
	recordsOutputPath: path.join(dist_folder, 'webpack.records.json'),
	output: {
		path: dist_folder,
		publicPath: "/",
		filename: 'bundle.js'
	},
	resolve: {
		extensions: ['*', '.webpack.js', '.web.js', '.ts', '.js']
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join('src', 'index.html'),
			filename: 'index.html'
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: conf.webpack.minimize,
			debug: conf.webpack.debug
		})
	].concat(
		!conf.webpack.minimize ? [] : [new webpack.optimize.UglifyJsPlugin({
				// beautify: true,
				// mangle: false,
				output: {
					comments: false
				},
				compress: {
					warnings: false,
					conditionals: true,
					unused: true,
					comparisons: true,
					sequences: true,
					dead_code: true,
					evaluate: true,
					if_return: true,
					join_vars: true,
					negate_iife: false // we need this for lazy v8
				},
				sourceMap: conf.webpack.sourcemaps
			})]
	).concat(
		!conf.webpack.analyze ? [] : [new BundleAnalyzerPlugin({
				analyzerMode: 'static', // server|disabled|static
				reportFilename: 'report.html',
				openAnalyzer: false,
				generateStatsFile: true,
				statsFilename: 'stats.json',
			})]
	),
	module: {

		loaders: [
			{test: /\.ts$/, enforce: 'pre', loader: 'tslint-loader'},
			{test: /\.ts$/, loader: 'awesome-typescript-loader'},
			{test: /\.html/, loader: 'raw-loader'},
			{test: /\.css$/, loader: "style-loader!css-loader"},
			{test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader'},
			{
				test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: 'file-loader?name=res/[name].[ext]?[hash]'
			},
		]
	},
	devServer: {
		contentBase: dist_folder,
		port: config.server.develop_port,
		proxy: [{
			path: '/api',
			target: 'http://' + config.server.host + ':' + config.server.port
		}]
	}
};
