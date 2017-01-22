module.exports = {
    entry: "./app.tsx",
    output: {
        filename: "app.js"
    },
    resolve: {
        extensions: ["", ".js", ".ts", ".tsx", ".css"]
    },
    module: {
        loaders: [
            { test: /\.tsx?$/i, loader: "ts" },
            { test: /\.css$/i,  loader: "style!css?modules&localIdentName=[name]-[local]" }
        ]
    }
};
