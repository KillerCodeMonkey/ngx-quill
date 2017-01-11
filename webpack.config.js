/**
 * Adapted from angular2-webpack-starter
 */

const webpack = require('webpack');

/**
 * Webpack Plugins
 */
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    devtool: 'inline-source-map',

    resolve: {
        extensions: ['.ts', '.js']
    },

    entry: './index.ts',

    output: {
        path: './bundles',
        filename: 'ngx-quill.umd.js',
        libraryTarget: 'umd',
        library: 'ngx-quill'
    },

    // require those dependencies but don't bundle them
    externals: [/^\@angular\//, /^rxjs\//, /^quill\//, nodeExternals()],

    module: {
        rules: [{
            enforce: 'pre',
            test: /\.ts$/,
            loader: 'tslint-loader',
            exclude: ['node_modules']
        }]
    },

    plugins: [
        // fix the warning in ./~/@angular/core/src/linker/system_js_ng_module_factory_loader.js
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
            './src'
        ),

        new webpack.LoaderOptionsPlugin({
            options: {
                tslintLoader: {
                    emitErrors: false,
                    failOnHint: false
                }
            }
        })
    ]
};