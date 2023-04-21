import postcssPresetEnv from 'postcss-preset-env'
import postCssImport from 'postcss-import'
import postcssAdvancedVariables from 'postcss-advanced-variables'
import postcssAtroot from 'postcss-atroot'
import postcssExtendRule from 'postcss-extend-rule'
import postcssNested from 'postcss-nested'
import postcssPropertyLookup from 'postcss-property-lookup'

const config = {
	plugins: [
    postCssImport,
    postcssAdvancedVariables(),
    postcssAtroot(),
    postcssExtendRule(),
    postcssNested(),
    postcssPresetEnv(),
    postcssPropertyLookup(),
	]
}

export default config