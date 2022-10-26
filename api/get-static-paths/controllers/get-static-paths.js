'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
//
module.exports = {
  handlePageJournalArticles: async ctx => {
    try {
      const articles = await strapi.query('journal-article').model.find(
        { published_at: { $ne: null } },
        {
          id: 1,
          slug: 1
        }
      )

      const articlesFiltered =
        articles
          ?.filter(article => article)
          ?.map(article => ({
            slug: article.slug || null
          })) || []

      const paths = articlesFiltered.map(article => ({
        params: {
          journalArticle: article.slug
        }
      }))

      return { paths }
    } catch (err) {
      console.log(err)
      return { paths: [] }
    }
  },
  handlePageProgram: async ctx => {
    const programType = ctx?.request?.url?.split('/')?.[3] || 'mini'

    try {
      const programs = await strapi
        .query('product')
        .model.find(
          { published_at: { $ne: null } },
          {
            id: 1,
            slug: 1,
            category: 1
          }
        )
        .populate([{ path: 'category', select: 'type slug' }])

      const programsFiltered =
        programs
          ?.filter(
            program => program && program?.category?.slug === programType
          )
          ?.map(program => ({
            slug: program.slug || null
          })) || []

      const paths = programsFiltered.map(program => ({
        params: {
          slug: program.slug
        }
      }))

      return { paths }
    } catch (err) {
      console.log(err)
      return { paths: [] }
    }
  },
  handlePageTeacher: async ctx => {
    try {
      const teachers = await strapi.query('teacher').model.find(
        { published_at: { $ne: null } },
        {
          id: 1,
          slug: 1
        }
      )

      const teachersFiltered =
        teachers
          ?.filter(teacher => teacher)
          ?.map(teacher => ({
            slug: teacher.slug || null
          })) || []

      const paths = teachersFiltered.map(teacher => ({
        params: {
          teacher: teacher.slug
        }
      }))

      return { paths }
    } catch (err) {
      console.log(err)
      return { paths: [] }
    }
  }
}
