'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

// const { handleRevalidate } = require('../../../helpers')

module.exports = {
  // lifecycles: {
  //   // beforeCreate: async data => {
  //   //   // const createSlugRes = createSlug({
  //   //   //   data,
  //   //   //   field: 'type',
  //   //   //   slug: 'slug'
  //   //   // })
  //   // },
  //   // beforeUpdate: async (params, data) => {
  //   //   // const createSlugRes = createSlug({
  //   //   //   data,
  //   //   //   field: 'type',
  //   //   //   slug: 'slug'
  //   //   // })
  //   // },
  //   afterCreate: async (result, data) =>
  //     await handleRevalidate({
  //       path: `/programs/${result.category.type}/online/${result.slug}`
  //     }),
  //   afterUpdate: async (result, params, data) =>
  //     await handleRevalidate({
  //       path: `/programs/${result.category.type}/online/${result.slug}`
  //     })
  // }
}
