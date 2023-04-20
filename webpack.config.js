import { resolve, join } from 'path'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import MiniCssExtractPlugin, { loader as _loader } from 'mini-css-extract-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import TranslationsPlugin from './webpack/translations-plugin'
import { devDependencies } from './package.json'

// this function reads Zendesk Garden npm dependencies from package.json and
// creates a jsDelivr url
const zendeskGardenJsDelivrUrl = (function () {
  const pkg = Object.keys(devDependencies).filter(item => item.includes('@zendeskgarden/css'))
  const getPkgName = (url, pkg) => {
    const version = devDependencies[pkg]
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
    'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.2/css/bootstrap.min.css'
  ],
  js: [
    'https://assets.zendesk.com/apps/sdk/2.0/zaf_sdk.js',
    'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js',
    'https://cdn.jsdelivr.net/jquery/3.0.0/jquery.min.js'
  ]
}

export const entry = {
  app: [
    '@babel/polyfill',
    './src/javascripts/locations/ticket_sidebar.js',
    './src/index.css'
  ]
}
export const output = {
  filename: '[name].js',
  path: resolve(__dirname, 'dist/assets')
}
export const module = {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env', '@babel/preset-react']
      }
    },
    {
      type: 'javascript/auto',
      test: /\.json$/,
      include: resolve(__dirname, './src/translations'),
      use: './webpack/translations-loader'
    },
    {
      test: /\.(sa|sc|c)ss$/,
      use: [
        _loader,
        { loader: 'css-loader', options: { url: false } },
        'postcss-loader'
      ]
    }
  ]
}
export const plugins = [
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
]
