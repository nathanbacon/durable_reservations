const HtmlWebpackPlugin = require("html-webpack-plugin");
const InlineSourceWebpackPlugin = require("inline-source-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
require("dotenv").config();

module.exports = (env) => ({
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(css)$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inlineSource: ".(js|css)$",
    }),
    new InlineSourceWebpackPlugin({
      compress: true,
      rootpath: "./src",
      noAssetMatch: "warn",
    }),
    new webpack.DefinePlugin({
      "process.env.CAPTCHA_SITE_KEY": JSON.stringify(
        env.CAPTCHA_SITE_KEY || process.env.CAPTCHA_SITE_KEY
      ),
      "process.env.API_ROOT": JSON.stringify(process.env.API_ROOT),
    }),
  ],
  output: {
    filename: "bundle",
  },
  optimization: {
    minimize: false,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 9000,
  },
});
