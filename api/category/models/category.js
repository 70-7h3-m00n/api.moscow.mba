'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const { createSlug, handleCopy } = require('../../../helpers')

module.exports = {
  lifecycles: {
    beforeCreate: async data => {
      const createSlugRes = createSlug({
        data,
        field: 'type',
        slug: 'slug'
      })
    },
    beforeUpdate: async (params, data) => {
      console.log('params ' + params)
      console.log('data ' + data)
      const createSlugRes = createSlug({
        data,
        field: 'type',
        slug: 'slug'
      })
    },
    afterCreate: async (result, data) => {
      if (data.locale === 'kk') {
        // return
      } else {
        const handleCopyRes = await handleCopy({ method: 'POST', data })
      }
    },
    afterUpdate: async (result, params, data) => {
      if (data.locale === 'kk') {
        // return
      } else {
        const handleCopyRes = await handleCopy({ method: 'PUT', data })
      }
    }
  }
}
