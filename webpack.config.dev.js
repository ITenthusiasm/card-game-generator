import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import VueLoaderPlugin from "vue-loader/lib/plugin";
import webpack from "webpack";

export default {
  mode: "development",
  devtool: "inline-source-map",
  entry: [
    path.resolve(__dirname, "src/main.ts"),
    "webpack-hot-middleware/client?noInfo=true",
  ],
  target: "web", // default
  output: {
    path: path.resolve(__dirname, "public"),
    publicPath: "/",
    filename: "bundle.js", // served in memory in dev mode
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "public/index.html", inject: true }),
    new VueLoaderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
  ],
  resolve: {
    extensions: [".js", ".ts", ".vue"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "src"),
        use: ["babel-loader"],
      },
      {
        test: /\.ts$/,
        include: path.resolve(__dirname, "src"),
        use: [
          { loader: "babel-loader" },
          {
            loader: "ts-loader",
            options: {
              appendTsSuffixTo: [/\.vue$/],
            },
          },
        ],
      },
      {
        test: /.vue$/,
        include: path.resolve(__dirname, "src"),
        use: ["vue-loader"],
      },
      {
        test: /.css$/,
        include: path.resolve(__dirname, "src"),
        use: ["vue-style-loader", "css-loader"],
      },
    ],
  },
};
