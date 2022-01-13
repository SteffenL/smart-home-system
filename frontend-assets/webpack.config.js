const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "production",
    target: "web",
    entry: {
        main: "./scripts/main.ts",
        dashboard: "./scripts/dashboard.ts"
    },
    output: {
        path: path.resolve(__dirname, "dist", "scripts"),
        filename: "[name].js"
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
