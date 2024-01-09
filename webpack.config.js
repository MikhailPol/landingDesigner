const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PostCssPresetEnv = require('postcss-preset-env');


module.exports = (env) => {
// Дополнительные переменные
  const isDev = env.mode === 'development';
  const isProd = env.mode === 'production';

  return {

    // Мод, вход, выход
    mode: env.mode ?? 'development',
    target: isDev ? 'web' : 'browserslist',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'js/[name].[contenthash].js',
      assetModuleFilename: 'assets/[name][ext]',
      clean: true
    },

    // Плагины
    plugins: [
      new HtmlWebpackPlugin({template: path.resolve(__dirname, 'src', 'index.html'), filename: 'index.html'}),
      isProd && new MiniCssExtractPlugin({filename: './css/style.css'})
    ].filter(Boolean),

    // Загрузчики
    module: {
      rules: [
        // Загрузка css
        {
          test: /\.s[ac]ss$/i,
          use: [
           isProd ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    PostCssPresetEnv,
                  ],
                },
              },
            },
            "sass-loader",
          ],
        },


        // Загрузка images
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/images/[name][ext]'
          }
        },

        // Загрузка шрифтов
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/fonts/[name][ext]',
          }
        },


        //Загрузка js
        {
          test: /\.(?:js|mjs|cjs)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: "defaults" }]
              ]
            }
          }
        }
      ],
    },


    // Инструменты разработки
    devtool: isDev && 'inline-source-map',
    // devtool:'inline-source-map',


    // Сервер разработки
    devServer: isDev ? {
      static: {
        directory: path.resolve(__dirname, 'src', 'index.html'),
      },
      port: 5000,
      open: true,
    }: undefined,
  };
}