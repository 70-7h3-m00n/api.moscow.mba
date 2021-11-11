'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  findReduced: async () => {
    // const product = await strapi
    //   .query('product')
    //   .find({ _limit: -1 })
    //   .select({
    //     id: 1,
    //     title: 1,
    //     slug: 1,
    //     studyFormat: 1
    //   })
    //   .populate('category.slug', 'category.type')
    // console.log(product)
    // const output = await strapi.query('product').model.find({}).select({
    //   id: 1,
    //   title: 1,
    //   slug: 1,
    //   studyFormat: 1,
    //   category: 1
    // })
    // console.log(product2)
    const programs = await strapi
      .query('product')
      .model.find({})
      .select(['id', 'title', 'slug', 'studyFormat', 'category'])
      .populate('category')

    // const output = programs.filter(program => program).map(program => {
    //   console.log(program)
    //   return {
    //     id: program.id,
    //     title: program.title,
    //     slug: program.slug,
    //     studyFormat: program.studyFormat,
    //     category: {
    //       id: program.category.id,
    //       type: program.category.type,
    //       slug: program.category.slug
    //     }
    //   }
    // })

    return programs
  }
}
