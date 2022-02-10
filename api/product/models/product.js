'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

// const { createSlug, copy, copyUpdate } = require('../../../helpers')
// const { programsUrl } = require('../../../config/config')

// module.exports = {
//   lifecycles: {
//     beforeCreate: async data => {
//       // const createSlugRes = createSlug({
//       //   data,
//       //   field: 'type',
//       //   slug: 'slug'
//       // })
//     },
//     beforeUpdate: async (params, data) => {
//       // const createSlugRes = createSlug({
//       //   data,
//       //   field: 'type',
//       //   slug: 'slug'
//       // })
//     },
//     afterCreate: async (result, data) => {
//       // if (data.locale === 'ru' && data.copyToKk === true) {
//       //   const copyResKk = await copy({
//       //     method: 'POST',
//       //     path: programsUrl,
//       //     locale: 'kk',
//       //     body: data,
//       //     id: result._id
//       //   })
//       // }
//     },
//     afterUpdate: async (result, params, data) => {
//       // if (result.locale === 'ru' && result.copyToKk === true) {
//       //   const copyUpdateResKk = await copyUpdate({
//       //     method: 'PUT',
//       //     path: programsUrl,
//       //     locale: 'kk',
//       //     body: data,
//       //     localizations: result.localizations
//       //   })
//       // }
//     }
//   }
// }

module.exports = {}
