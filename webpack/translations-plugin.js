import { resolve } from 'path'
import { readFileSync } from 'fs'

const JS_INDENT = 2

const marketplaceKeys = [
  'name',
  'description',
  'short_description',
  'long_description',
  'installation_instructions',
  'parameters'
]

export class TranslationsPlugin {
  constructor (options) {
    this.options = options
  }

  apply (compiler) {
    compiler.hooks.thisCompilation.tap('TranslationsPlugin', (compilation) => {
      compilation.hooks.processAssets.tapAsync(
        {
          name: 'TranslationsPlugin',
          stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
        },
        (assets, callback) => {
          Object.assign(
            assets,
            buildMarketplaceTranslationFile('en.json', this.options.path)
          )
          callback()
        }
      )
    })
  }
}

function buildMarketplaceTranslationFile (filename, filepath) {
  let translationsInput
  try {
    translationsInput = JSON.parse(readFileSync(resolve(filepath, filename)))
  } catch (err) {
    console.error(err)
    process.exit(1)
  }

  const translationsPath = `../translations/${filename}`
  const marketplaceTranslations = extractMarketplaceTranslation(translationsInput, filename)

  return {
    [translationsPath]: {
      size: () => marketplaceTranslations.length,
      source: () => marketplaceTranslations
    }
  }
}

function extractMarketplaceTranslation (translations, filename) {
  const translationsOutput = {
    _warning: `AUTOMATICALLY GENERATED FROM $/src/translations/${filename} - DO NOT MODIFY THIS FILE DIRECTLY`,
    app: {}
  }

  marketplaceKeys.forEach(
    key => {
      if (translations.app[key]) translationsOutput.app[key] = translations.app[key]
    }
  )

  return JSON.stringify(translationsOutput, null, JS_INDENT)
}
