import { faker } from '@faker-js/faker'

/**
 * Generates a Zendesk custom_field object with random values
 * Randomly generated values are overidable through default params
 *
 * @param {*} num number of custom fields to generate
 * @param {*} fieldDefaults Overrides the randomly generated field values
 */
const customFieldFactory = (num = 5, fieldDefaults = {}) => {
  const customFields = []
  for (let i = 0; i < num; i += 1) {
    customFields.push({
      id: faker.datatype.number(),
      value: `${faker.datatype.number()}`,
      ...fieldDefaults
    })
  }

  return customFields
}

export default customFieldFactory
