var Webpack = require('webpack'),
    env = process.env.NODE_ENV;

module.exports = function(dest, release) {

    if (typeof release === 'undefined') {
        release = (env === 'production');
    }

    return {
        entry: './scripts/main',

        output: {
            filename: 'main.js',
            path: dest + '/javascript/',
            publicPath: dest + '/javascript/'
        },

        cache: !release,
        debug: !release,
        devtool: !release ? 'source-map' : false,

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
            extensions: ['', '.js', '.jsx']
        },

        jshint: {
            camelcase: true,
            curly: true,
            expr: true,
            multistr: true,
            eqeqeq: true,
            indent: 4,
            esnext: true,
            browser: true,
            proto: true
        },

        module: {
            preLoaders: [{
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: 'jsxhint'
            }],
            loaders: [{
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader:'6to5?experimental&optional=selfContained'
            }]
        }
    };
};
