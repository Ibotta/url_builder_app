import postcssPresetEnv from 'postcss-preset-env'
import postcssImport from 'postcss-import'

const config = {
  plugins: [
    postcssImport,
    postcssPresetEnv()
  ]
}

export default config
