const path = require('path');
const webpack = require('webpack');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // css 파일도 빈칸을 없애는 압축
const childProcess = require('child_process'); // command 명령어 사용가능
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 이전 빌드내용 삭제 플러그인
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 여러 css파일을 하나의 css 파일로 병합
const HtmlWebpackPlugin = require('html-webpack-plugin'); //  HTML 파일 생성을 단순화
const TerserPlugin = require('terser-webpack-plugin'); // console.log 제거 옵션
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin'); // ts-loader의 성능을 향상
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = (env) => {
  const DOTEVN_PATH = `.env.${env.mode}`;
  const mode = env.mode !== 'developer' ? 'production' : env.mode;
  console.log(
    '\x1b[33m%s\x1b[0m',
    `*****************************************************************`,
  );
  console.log('\x1b[33m%s\x1b[0m', `                [WEB_PACK ENV] : ${env.mode}                 `);
  console.log(
    '\x1b[33m%s\x1b[0m',
    `*****************************************************************`,
  );

  return {
    mode,
    entry: './src/index.tsx',
    output: {
      path: path.join(__dirname, './dist'),
      filename: '[name]_bundle.js',
      assetModuleFilename: 'assets/images/[name][ext]',
      clean: true,
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: true,
      port: 3000,
      liveReload: true,
      hot: false,
      historyApiFallback: true,
      // proxy: {
      //   '/api/': {
      //     // /api/로 시작하는 url은 아래의 전체 도메인을 추가하고, 옵션을 적용
      //     target: `https://dapi-hospital.whatailsyou.app/api`,
      //     changeOrigin: true,
      //   },
      // },
    },
    resolve: {
      // 확장자를 순서대로 해석
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
      plugins: [new TsconfigPathsPlugin()],
    },
    optimization: {
      minimizer:
        env.mode === 'production'
          ? [
              new OptimizeCSSAssetsPlugin(),
              new TerserPlugin({
                terserOptions: {
                  compress: {
                    drop_console: true, // 콘솔 로그를 제거한다
                  },
                },
              }),
            ]
          : [],
    },
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: [
            'babel-loader',
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
              },
            },
          ],
        },

        {
          test: /\.(sa|sc|c)ss$/i,
          use: [
            env.mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'sass-loader',
          ], // 순서 중요함, 뒤에서 부터 실행
        },
        {
          test: /\.(png|jpe?g|gif|svg|ico)$/i,
          loader: 'url-loader',
          options: {
            name: '[name].[ext]?[hash]', // hash 처리(캐시)
            limit: 20000, // 2kb 최대
          },
        },
        {
          test: /\.(woff|woff2|ttf|otf)$/i,
          type: 'asset/inline',
        },
        {
          test: /\.txt/i,
          type: 'asset/source',
        },
      ],
    },
    plugins: [
      // TODO: 환경구분 webpack5 env 사용 불가능
      // NOTE: DefinePlugin webpack이 빌드하는 동안에만 사용됨
      new webpack.DefinePlugin({
        ENV_MODE: JSON.stringify(env.mode),
      }),
      new Dotenv({
        path: DOTEVN_PATH,
      }),
      new webpack.BannerPlugin({
        banner: `
        Build Date: ${new Date().toLocaleString()}
        Commit Version: ${childProcess.execSync('git rev-parse --short HEAD')},
        Author: ${childProcess.execSync('git config user.name')}
      `,
      }),
      //css 파일과 js파일을 각각 html파일의 link태그, script태그로 추가
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: './index.html',
        favicon: `./public/favicon.ico`,
        templateParameters: {
          env: env.mode === 'development' ? '(개발용)' : '',
        },
        minify:
          // 디버깅쉽게 하기위해 production 환경에서만 설정
          env.mode === 'production'
            ? {
                collapseWhitespace: true, // 빈칸 제거
                removeComments: true, // 주석제거
              }
            : false,
      }),
      // dist Folder delete
      new CleanWebpackPlugin({
        banner: `build time : ${new Date().toLocaleTimeString()}`,
        cleanStaleWebpackAssets: false,
      }),
      // javascript css 뽑기(개발환경에는 필요가없음)
      // loader 설정이 추가로 필요함
      ...(env.mode === 'production'
        ? [
            new MiniCssExtractPlugin({
              filename: '[name].css',
            }),
          ]
        : []),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          diagnosticOptions: {
            semantic: true,
            syntactic: true,
          },
        },
      }),
    ],
  };
};
