const { DefinePlugin, optimize } = require("webpack");
const { UglifyJsPlugin } = optimize;
const prod = process.argv.indexOf('-p') !== -1;

module.exports = {
    entry: [ /*"modernizr",*/ "./app.tsx" ],
    output: {
        filename: "app.js"
    },
    resolve: {
        extensions: ["", ".js", ".ts", ".tsx"]
    },
    module: {
        loaders: [
            { test: /\.tsx?$/i, loader: "ts" },
            { test: /\.css$/i,  loader: "style!css?-url&modules&localIdentName=[name]-[local]!postcss" },
            { test: /\.less$/i,  loader: "style!css?-url&modules&localIdentName=[name]-[local]!postcss!less" },
            { test: /\.svg$/i,  loader: "svg-url?noquotes" }
        ]
    },
    plugins: [
        new DefinePlugin({
            "process.env": {
                NODE_ENV: prod ?
                    `"production"` :
                    `"development"`
            }
        })
    ]
};
