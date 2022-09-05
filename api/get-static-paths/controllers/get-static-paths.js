'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

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

      return { articles: articlesFiltered }
    } catch (err) {
      console.log(err)
      return { articles: [] }
    }
  }
}
