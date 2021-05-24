import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import VueLoaderPlugin from "vue-loader/lib/plugin";
import webpack from "webpack";

const config: webpack.Configuration = {
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
  stats: "errors-warnings",
  plugins: [
    new HtmlWebpackPlugin({ template: "public/index.html", inject: true }),
    new VueLoaderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.EnvironmentPlugin(["CLIENT_SOCKET_URL"]),
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
        test: /\.ts$/,
        include: path.resolve(__dirname, "src"),
        use: [
          "babel-loader",
          { loader: "ts-loader", options: { appendTsSuffixTo: [/\.vue$/] } },
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

export default config;
