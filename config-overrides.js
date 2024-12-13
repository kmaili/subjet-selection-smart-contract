
module.exports = {
    resolve: {
        fallback: {
            "crypto": require.resolve("crypto-browserify"),
            "os": require.resolve("os-browserify/browser"),
            "stream": require.resolve("stream-browserify"),
            "buffer": require.resolve("buffer/"),
            "path": require.resolve("path-browserify"),
            "vm": require.resolve("vm-browserify")
        }
    }
};
