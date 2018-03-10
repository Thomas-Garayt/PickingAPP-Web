const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function (env) {
    const debug = env !== 'production';
    console.log('Debug :', debug);

    return {
        resolve: {
            modules: ['node_modules', 'src'],
            extensions: ['.js', '.jsx'],
        },

        context: path.join(__dirname, 'src'),
        devtool: debug ? 'inline-sourcemap' : false,
        entry: ['babel-polyfill', './App.jsx', '../styles/style.scss'],
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['react', 'es2015', 'stage-0'],
                        plugins: [
                            'react-html-attrs',
                            'transform-class-properties',
                            'transform-decorators-legacy',
                            ['import', { libraryName: 'antd' }],
                        ],
                    },
                },
                {
                    test: /\.scss$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        // resolve-url-loader may be chained before sass-loader if necessary
                        use: ['css-loader', 'sass-loader'],
                    }),
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2)$/,
                    loader: 'file-loader?name=fonts/[name].[ext]',
                },
            ],
        },
        output: {
            path: `${__dirname}/public/`,
            filename: debug ? 'app-dev.min.js' : 'app.min.js',
        },
        plugins: debug
            ? [
                new ExtractTextPlugin({
                    filename: 'style-dev.min.css',
                    allChunks: true,
                }),
            ]
            : [
                new webpack.optimize.UglifyJsPlugin({
                    mangle: false,
                    sourcemap: false,
                }),
                new ExtractTextPlugin({
                    filename: 'style.min.css',
                    allChunks: true,
                }),
            ],
    };
};
