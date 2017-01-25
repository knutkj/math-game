module.exports = {
    entry: "./app.tsx",
    output: {
        filename: "app.js"
    },
    resolve: {
        extensions: ["", ".js", ".ts", ".tsx"]
    },
    module: {
        loaders: [
            { test: /\.tsx?$/i, loader: "ts" },
            { test: /\.css$/i,  loader: "style!css?-url&modules&localIdentName=[name]-[local]" },
            { test: /\.less$/i,  loader: "style!css?-url&modules&localIdentName=[name]-[local]!less" }
        ]
    }
};
