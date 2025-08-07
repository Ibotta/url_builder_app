import { resolve, join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import dependencies from './package.json' with { type: 'json' }
import { TranslationsPlugin } from './webpack/translations-plugin.js'
import TerserPlugin from 'terser-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// this function reads Zendesk Garden npm dependencies from package.json and
// creates a jsDelivr url
const zendeskGardenJsDelivrUrl = (function () {
  const pkg = Object.keys(dependencies).filter(item => item.includes('@zendeskgarden/css'))
  const getPkgName = (url, pkg) => {
    const version = dependencies[pkg]
      .replace(/^[\^~]/g, '')
      .replace(/\.\d$/, '')
    url = `${url}npm/${pkg}@${version},`
    return url
  }
  return pkg.length && pkg.reduce(
    getPkgName,
    'https://cdn.jsdelivr.net/combine/'
  ).slice(0, -1)
}())

const externalAssets = {
  css: [
    zendeskGardenJsDelivrUrl,
    'https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css'
  ],
  js: [
    'https://static.zdassets.com/zendesk_app_framework_sdk/2.0/zaf_sdk.min.js',
    'https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js'
  ]
}
export default {
  "entry": {
    app: [
      'core-js/stable',
      './src/javascripts/locations/ticket_sidebar.js',
      './src/styles/index.css'
    ]
  },
  
  "output": {
    filename: '[name].js',
    path: resolve(__dirname, 'dist/assets')
  },

  "module": {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      },
      {
        type: 'javascript/auto',
        test: /\.json$/,
        include: resolve(__dirname, './src/translations'),
        use: './webpack/translations-loader'
      },
      {
        test: /\.(sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { url: false }
          },
          'postcss-loader'
        ]
      }
    ]
  },

  "plugins": [
    // Empties the dist folder
    new CleanWebpackPlugin({
      verbose: true,
      cleanOnceBeforeBuildPatterns: [join(process.cwd(), 'dist/**/*')]
    }),

    // Copy over static assets
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/manifest.json', to: '../[name][ext]' },
        { from: 'src/images/*', to: './[name][ext]' }
      ]
    }),

    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),

    new TranslationsPlugin({
      path: resolve(__dirname, './src/translations')
    }),

    new HtmlWebpackPlugin({
      warning: 'AUTOMATICALLY GENERATED FROM ./src/templates/iframe.html - DO NOT MODIFY THIS FILE DIRECTLY',
      vendorCss: externalAssets.css.filter(path => !!path),
      vendorJs: externalAssets.js,
      template: './src/templates/iframe.html',
      filename: 'iframe.html'
    })
  ],

  "optimization": {
    minimize: true,
    minimizer: [new TerserPlugin({
        terserOptions: {
            format: {
                comments: false,
            },
        },
        extractComments: false,
    })],
  },
}