const HtmlWebpackPlugin = require("html-webpack-plugin");
const InlineSourceWebpackPlugin = require("inline-source-webpack-plugin");

module.exports = {
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
  ],
  output: {
    filename: "bundle.js",
  },
  optimization: {
    minimize: false,
  },
};
