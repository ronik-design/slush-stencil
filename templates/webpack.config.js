var Webpack = require('webpack');

/**
 * Get configuration for Webpack
 *
 * @see http://webpack.github.io/docs/configuration
 *      https://github.com/petehunt/webpack-howto
 *
 * @param {boolean} release True if configuration is intended to be used in
 * a release mode, false otherwise
 * @return {object} Webpack configuration
 */
module.exports = function(release, dest) {
    return {
        entry: './scripts/main.js',

        output: {
            filename: 'main.js',
            path: dest + '/javascript/',
            publicPath: dest + '/javascript/'
        },

        cache: !release,
        debug: !release,
        devtool: !release ? 'inline-source-map' : false,

        stats: {
            colors: true,
            reasons: !release
        },

        plugins: release ? [
            new Webpack.DefinePlugin({
                'process.env.NODE_ENV': '"production"',
                '__DEV__': false
            }),
            new Webpack.optimize.DedupePlugin(),
            new Webpack.optimize.UglifyJsPlugin(),
            new Webpack.optimize.OccurenceOrderPlugin(),
            new Webpack.optimize.AggressiveMergingPlugin()
        ] : [
            new Webpack.DefinePlugin({
                '__DEV__': true
            })
        ],

        resolve: {
            extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
        },

        module: {
            preLoaders: [{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'jshint-loader'
            }],
            loaders: [{
                test: /\.jsx?$/,
                loader: 'jsx'
            }, {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: '6to5?experimental&optional=selfContained'
            }]
        }
    };
};
