const path = require("path");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    //mode: "production",
    mode: "development",
    target: "web",
    entry: {
        main: "./src/main.ts"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        assetModuleFilename: "assets/[contenthash][ext][query]",
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "esbuild-loader",
                options: {
                    loader: "tsx",
                    target: "es2015"
                }
            },
            {
                test: /\.vue$/,
                use: ["vue-loader"]
            },
            {
                test: /\.s[ac]ss$/,
                use: ["style-loader", "sass-loader"]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(gif|jpg|png|eot|svg|ttf|woff)$/,
                type: "asset/resource"
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new WebpackPwaManifest({
            name: "Smart Home System",
            short_name: "Smart Home",
            description: "Smart Home System",
            background_color: "#ffffff",
            display: "standalone",
            publicPath: "/",
            manifest_version: 2,
            version: "1.0.0",
            start_url: "https://smart-home.dev.langn.es/",
            icons: [
                {
                    src: path.resolve(path.join(__dirname, "assets/icon.png")),
                    sizes: [192, 512]
                }
            ]
        }),
        new HtmlWebpackPlugin({
            title: "Smart Home System",
            template: "./index.template.html",
            inject: false
        })
    ],
    performance: {
        hints: false
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendorsVue: {
                    test: /[\\/]node_modules[\\/]vue/,
                    name: "vue",
                    chunks: "all",
                    filename: "[contenthash].js",
                    priority: -10,
                    reuseExistingChunk: true
                },
                vendorsPrime: {
                    test: /[\\/]node_modules[\\/]vuetify/,
                    name: "vuetify",
                    chunks: "all",
                    filename: "[contenthash].js",
                    priority: -20,
                    reuseExistingChunk: true
                },
                vendorsBundle: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "bundle",
                    chunks: "all",
                    filename: "[contenthash].js",
                    priority: -100,
                    reuseExistingChunk: true
                }
            }
        }
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    devServer: {
        //hot: false,
        //liveReload: false
    }
}
