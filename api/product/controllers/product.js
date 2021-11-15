'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  getStaticProps: async () => {
    const programs = await strapi
      .query('product')
      .model.find(
        {},
        {
          // id: 1,
          // title: 1,
          // slug: 1,
          // studyFormat: 1,
          // category: 1,
          study_field: 0,
          whatWillYouLearn: 0,
          specializedSubjects: 0,
          duration: 0,
          baseSubjects: 0,
          programModulesCounters: 0,
          diplomas: 0,
          whoIsFor: 0,
          specializedSubjectsAddons: 0,
          picture: 0,
          subjectsStickerType: 0,
          localizations: 0,
          id: 0,
          published_at: 0,
          locale: 0,
          goal: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
          created_by: 0,
          updated_by: 0,
          showInMenu: 0,
          copyToKk: 0,
          description: 0,
          price: 0,
          discount: 0,
          questions: 0,
          reviews: 0
        }
      )
      .populate([{ path: 'category', select: 'type slug' }])

    return programs
  },
  getStaticPropsProfession: async () => {
    const programs = await strapi
      .query('product')
      .model.find(
        {},
        {
          // id: 1,
          // title: 1,
          // slug: 1,
          // studyFormat: 1,
          // category: 1,
          // study_field: 1,
          // duration: 1
          whatWillYouLearn: 0,
          specializedSubjects: 0,
          baseSubjects: 0,
          programModulesCounters: 0,
          diplomas: 0,
          whoIsFor: 0,
          specializedSubjectsAddons: 0,
          picture: 0,
          subjectsStickerType: 0,
          localizations: 0,
          id: 0,
          published_at: 0,
          locale: 0,
          goal: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
          created_by: 0,
          updated_by: 0,
          showInMenu: 0,
          copyToKk: 0,
          description: 0,
          price: 0,
          discount: 0,
          questions: 0,
          reviews: 0
        }
      )
      .populate([
        { path: 'category', select: 'type slug' },
        { path: 'study_field', select: 'id name' },
        { path: 'duration', select: 'minStudyMonths' }
      ])

    return programs
  },
  getStaticPropsPromo: async () => {
    const programs = await strapi
      .query('product')
      .model.find(
        {},
        {
          // id: 1,
          // title: 1,
          // slug: 1,
          // studyFormat: 1,
          // category: 1,
          // whatWillYouLearn: 1
          study_field: 0,
          specializedSubjects: 0,
          duration: 0,
          baseSubjects: 0,
          programModulesCounters: 0,
          diplomas: 0,
          whoIsFor: 0,
          specializedSubjectsAddons: 0,
          picture: 0,
          subjectsStickerType: 0,
          localizations: 0,
          id: 0,
          published_at: 0,
          locale: 0,
          goal: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
          created_by: 0,
          updated_by: 0,
          showInMenu: 0,
          copyToKk: 0,
          description: 0,
          price: 0,
          discount: 0,
          questions: 0,
          reviews: 0
        }
      )
      .populate([
        { path: 'category', select: 'type slug' },
        { path: 'whatWillYouLearn' }
      ])

    return programs
  },
  getProgram: async ctx => {
    const typeSlug = ctx.request.url.split('/')[3].split('.')
    const type = typeSlug[0]
    const slug = typeSlug[1]

    const program = await strapi
      .query('product')
      .model.find({ slug })
      .populate([
        {
          path: 'category',
          select: 'type slug',
          match: { type: { $eq: type } }
        }
      ])
      .exec()

    return program.filter(item => item.category?.type === type)[0]
  },
  getStaticPaths: async ctx => {
    const type = ctx.request.url.split('/')[3]

    const paths = await strapi
      .query('product')
      .model.find(
        {},
        {
          // slug: 1,
          // studyFormat: 1,
          // category: 1,
          id: 0,
          title: 0,
          whatWillYouLearn: 0,
          study_field: 0,
          specializedSubjects: 0,
          duration: 0,
          baseSubjects: 0,
          programModulesCounters: 0,
          diplomas: 0,
          whoIsFor: 0,
          specializedSubjectsAddons: 0,
          picture: 0,
          subjectsStickerType: 0,
          localizations: 0,
          id: 0,
          published_at: 0,
          locale: 0,
          goal: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
          created_by: 0,
          updated_by: 0,
          showInMenu: 0,
          copyToKk: 0,
          description: 0,
          price: 0,
          discount: 0,
          questions: 0,
          reviews: 0
        }
      )
      .populate([
        {
          path: 'category',
          select: 'type slug',
          match: { type: { $eq: type } }
        }
      ])
      .exec()

    return paths.filter(path => path.category?.type === type)
  }
}
