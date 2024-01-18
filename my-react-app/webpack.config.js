const HtmlWebpackPlugin = require("html-webpack-plugin");
const InlineSourceWebpackPlugin = require("inline-source-webpack-plugin");
const webpack = require("webpack");
require("dotenv").config();

console.log(JSON.stringify(process.env.CAPTCHA_SITE_KEY));
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
        use: [{ loader: "css-loader" }],
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
      "process.env.CAPTCHA_SITE_KEY": JSON.stringify(env.CAPTCHA_SITE_KEY),
    }),
  ],
  output: {
    filename: "bundle.js",
  },
  optimization: {
    minimize: false,
  },
});
