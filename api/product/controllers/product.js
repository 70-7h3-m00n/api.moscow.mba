'use strict'
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { createBlended } = require('../../../helpers/index')

module.exports = {
  getStaticProps: async () => {
    const programs = await strapi
      .query('product')
      .model.find(
        { published_at: { $ne: null } },
        {
          // id: 1,
          // title: 1,
          // slug: 1,
          // studyFormat: 1,
          // category: 1,
          // price: 1
          // study_field: 1,
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
          discount: 0,
          questions: 0,
          reviews: 0
        }
      )
      .populate([
        { path: 'category', select: 'type slug' },
        { path: 'study_field', select: 'id name slug description' }
      ])

    const teachers = await strapi.query('teacher').model.find(
      { published_at: { $ne: null } },
      {
        // programs: 0,
        copyToKk: 0,
        createdAt: 0,
        created_by: 0,
        locale: 0,
        localizations: 0,
        updatedAt: 0,
        updated_by: 0,
        __v: 0,
        id: 0
      }
    )

    const programsWithBlended = createBlended(programs)

    return {
      programs: programsWithBlended,
      teachers: teachers.filter(
        (v, i, a) => a.findIndex(t => t.slug === v.slug) === i
      )
    }
  },
  getStaticPropsProfession: async () => {
    const programs = await strapi
      .query('product')
      .model.find(
        { published_at: { $ne: null } },
        {
          // id: 1,
          // title: 1,
          // slug: 1,
          // studyFormat: 1,
          // category: 1,
          // study_field: 1,
          // duration: 1
          // price: 1
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
          discount: 0,
          questions: 0,
          reviews: 0
        }
      )
      .populate([
        { path: 'category', select: 'type slug' },
        { path: 'study_field', select: 'id name slug description' },
        { path: 'duration', select: 'minStudyMonths' }
      ])

    const teachers = await strapi.query('teacher').model.find(
      { published_at: { $ne: null } },
      {
        // programs: 0,
        copyToKk: 0,
        createdAt: 0,
        created_by: 0,
        locale: 0,
        localizations: 0,
        updatedAt: 0,
        updated_by: 0,
        __v: 0,
        id: 0
      }
    )

    const programsWithBlended = createBlended(programs)

    return {
      programs: programsWithBlended,
      teachers: teachers.filter(
        (v, i, a) => a.findIndex(t => t.slug === v.slug) === i
      )
    }
  },
  getStaticPropsCourse: async () => {
    const programs = await strapi
      .query('product')
      .model.find(
        { published_at: { $ne: null } },
        {
          // id: 1,
          // title: 1,
          // slug: 1,
          // studyFormat: 1,
          // category: 1,
          // study_field: 1,
          // duration: 1
          // price: 1
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
          discount: 0,
          questions: 0,
          reviews: 0
        }
      )
      .populate([
        { path: 'category', select: 'type slug' },
        { path: 'study_field', select: 'id name slug description' },
        { path: 'duration', select: 'minStudyMonths' }
      ])

    const teachers = await strapi.query('teacher').model.find(
      { published_at: { $ne: null } },
      {
        // programs: 0,
        copyToKk: 0,
        createdAt: 0,
        created_by: 0,
        locale: 0,
        localizations: 0,
        updatedAt: 0,
        updated_by: 0,
        __v: 0,
        id: 0
      }
    )

    const programsWithBlended = createBlended(programs)

    return {
      programs: programsWithBlended,
      teachers: teachers.filter(
        (v, i, a) => a.findIndex(t => t.slug === v.slug) === i
      )
    }
  },
  getStaticPropsPromo: async () => {
    const programs = await strapi
      .query('product')
      .model.find(
        { published_at: { $ne: null } },
        {
          // id: 1,
          // title: 1,
          // slug: 1,
          // studyFormat: 1,
          // category: 1,
          // whatWillYouLearn: 1
          // price: 1
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
          discount: 0,
          questions: 0,
          reviews: 0
        }
      )
      .populate([
        { path: 'category', select: 'type slug' },
        { path: 'whatWillYouLearn' }
      ])

    const teachers = await strapi.query('teacher').model.find(
      { published_at: { $ne: null } },
      {
        // programs: 0,
        copyToKk: 0,
        createdAt: 0,
        created_by: 0,
        locale: 0,
        localizations: 0,
        updatedAt: 0,
        updated_by: 0,
        __v: 0,
        id: 0
      }
    )

    const programsTypeMini = programs.filter(
      item => item.category?.type === 'mini'
    )

    return {
      programs: programsTypeMini,
      teachers: teachers.filter(
        (v, i, a) => a.findIndex(t => t.slug === v.slug) === i
      )
    }
  },
  getProgram: async ctx => {
    const typeSlug = ctx.request.url.split('/')[3].split('.')
    const type = typeSlug[0]
    const slug = typeSlug[1]

    const programs = await strapi
      .query('product')
      .model.find({ slug, published_at: { $ne: null } })
      .populate([
        {
          path: 'category',
          select: 'type slug',
          match: { type: { $eq: type } }
        },
        { path: 'study_field', select: 'id name slug description' }
      ])
      .populate([
        {
          path: 'teachers',
          select: 'name picture description'
        }
      ])
      .exec()

    const program = programs.filter(item => item.category?.type === type)[0]

    return [program].map(item => {
      item.teachers.map(teacher => {
        teacher.programs = undefined
        return teacher
      })
      return item
    })[0]
  },
  getStaticPaths: async ctx => {
    const type = ctx.request.url.split('/')[3]

    const paths = await strapi
      .query('product')
      .model.find(
        { published_at: { $ne: null } },
        {
          // slug: 1,
          // studyFormat: 1,
          // category: 1,
          // price: 1
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

    const pathsFiltered = paths.filter(path => path.category?.type === type)

    const output = pathsFiltered.map(({ slug }) => ({
      params: { slug }
    }))

    return output
  }
}
