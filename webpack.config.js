//@ts-check
"use strict";

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require("webpack");

/** @type WebpackConfig */
const webConfig = {
    context: __dirname,
    mode: "none", // this leaves the source code as close as possible to the original (when packaging we set this to 'production')
    target: "webworker", // web extensions run in a webworker context
    entry: {
        "extension-web": "./src/extension.ts", // source of the web extension main file
        "test/suite/index-web": "./src/test/suite/index-web.ts", // source of the web extension test runner
    },
    output: {
        filename: "[name].js",
        path: path.join(__dirname, "./dist"),
        libraryTarget: "commonjs",
    },
    resolve: {
        mainFields: ["browser", "module", "main"], // look for `browser` entry point in imported node modules
        extensions: [".ts", ".js"], // support ts-files and js-files
        alias: {
            // provides alternate implementation for node module and source files
        },
        fallback: {
            // Webpack 5 no longer polyfills Node.js core modules automatically.
            // see https://webpack.js.org/configuration/resolve/#resolvefallback
            // for the list of Node.js core module polyfills.
            assert: require.resolve("assert"),
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader",
                    },
                ],
            },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: "process/browser", // provide a shim for the global `process` variable
        }),
    ],
    externals: {
        vscode: "commonjs vscode", // ignored because it doesn't exist
    },
    performance: {
        hints: false,
    },
    devtool: "nosources-source-map", // create a source map that points to the original source file
    infrastructureLogging: {
        level: "log", // enables logging required for problem matchers
    },
};
const nodeConfig = /** @type WebpackConfig */ {
    context: __dirname,
    mode: "none", // this leaves the source code as close as possible to the original (when packaging we set this to 'production')
    target: "node", // extensions run in a node context
    entry: {
        "extension-node": "./src/extension.ts", // source of the node extension main file
        "test/suite/index-node": "./src/test/suite/index-node.ts", // source of the node extension test runner
        "test/suite/extension.test": "./src/test/suite/extension.test.ts", // create a separate file for the tests, to be found by glob
        "test/runTest": "./src/test/runTest", // used to start the VS Code test runner (@vscode/test-electron)
    },
    output: {
        filename: "[name].js",
        path: path.join(__dirname, "./dist"),
        libraryTarget: "commonjs",
    },
    resolve: {
        mainFields: ["module", "main"],
        extensions: [".ts", ".js"], // support ts-files and js-files
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader",
                    },
                ],
            },
        ],
    },
    externals: {
        vscode: "commonjs vscode", // ignored because it doesn't exist
        mocha: "commonjs mocha", // don't bundle
        "@vscode/test-electron": "commonjs @vscode/test-electron", // don't bundle
        "@vscode/test-web": "commonjs @vscode/test-web", // don't bundle
    },
    performance: {
        hints: false,
    },
    devtool: "nosources-source-map", // create a source map that points to the original source file
};

module.exports = [webConfig, nodeConfig];
