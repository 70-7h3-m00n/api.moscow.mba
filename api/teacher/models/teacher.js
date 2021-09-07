'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const { createSlug, copy, copyUpdate } = require('../../../helpers')
const { teachersUrl } = require('../../../config/config')

module.exports = {
  lifecycles: {
    beforeCreate: async data => {
      const createSlugRes = createSlug({
        data,
        field: 'name',
        slug: 'slug'
      })
    },
    beforeUpdate: async (params, data) => {
      const createSlugRes = createSlug({
        data,
        field: 'name',
        slug: 'slug'
      })
    },
    afterCreate: async (result, data) => {
      // console.log('result')
      // console.log(JSON.stringify(result))
      // console.log('data')
      // console.log(JSON.stringify(data))
      if (data.locale === 'ru' && data.copyToKk === true) {
        const copyResKk = await copy({
          method: 'POST',
          path: teachersUrl,
          locale: 'kk',
          body: data,
          id: result._id
        })
      }
    },
    afterUpdate: async (result, params, data) => {
      // console.log('result')
      // console.log(JSON.stringify(result))
      // console.log('params')
      // console.log(JSON.stringify(params))
      // console.log('data')
      // console.log(JSON.stringify(data))
      if (result.locale === 'ru' && result.copyToKk === true) {
        const copyUpdateResKk = await copyUpdate({
          method: 'PUT',
          path: teachersUrl,
          locale: 'kk',
          body: data,
          localizations: result.localizations
        })
      }
    }
  }
}
