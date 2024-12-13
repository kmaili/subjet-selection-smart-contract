const webpack = require('webpack');

module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.resolve.fallback = {
                "crypto": require.resolve("crypto-browserify"),
                "os": require.resolve("os-browserify/browser"),
                "stream": require.resolve("stream-browserify"),
                "buffer": require.resolve("buffer/"),
                "path": require.resolve("path-browserify"),
                "vm": require.resolve("vm-browserify")
            };

            webpackConfig.plugins = [
                ...webpackConfig.plugins,
                new webpack.ProvidePlugin({
                    Buffer: ['buffer', 'Buffer'],
                }),
                new webpack.ProvidePlugin({
                    process: 'process/browser',
                }),
            ];

            return webpackConfig;
        }
    }
};