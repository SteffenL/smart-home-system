const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "production",
    target: "web",
    entry: "./scripts/main.ts",
    output: {
        path: path.resolve(__dirname, "dist", "scripts"),
        filename: "main.js"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: "ts-loader",
                    options: {
                        configFile: "tsconfig.json"
                    }
                },
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "images", to: path.resolve(__dirname, "dist", "images") }
            ]
        })
    ]
};
