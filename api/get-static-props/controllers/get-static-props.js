'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { createBlended } = require('../../../helpers/index')

module.exports = {
  default: async ctx => {
    const programs = await strapi
      .query('product')
      .model.find(
        { published_at: { $ne: null } },
        {
          id: 1,
          title: 1,
          slug: 1,
          studyFormat: 1,
          category: 1,
          study_field: 1
        }
      )
      .populate([
        { path: 'category', select: 'type slug' },
        { path: 'study_field', select: 'id name slug description' }
      ])

    const programsFiltered =
      programs
        ?.filter(program => program)
        ?.map(program => ({
          _id: program._id || null,
          id: program.id || null,
          title: program.title || null,
          slug: program.slug || null,
          studyFormat: program.studyFormat || null,
          category: {
            type: program.category?.type || null,
            slug: program.category?.slug || null
          },
          study_field: {
            id: program.study_field?.id || null,
            name: program.study_field?.name || null,
            slug: program.study_field?.slug || null,
            description: program.study_field?.description || null
          }
        })) || []

    return { programs: createBlended(programsFiltered) }
  },
  getStaticPropsPageJournalArticle: async ctx => {
    return {}
  },
  getStaticPropsPageJournalArticles: async ctx => {
    return {}
  },
  getStaticPropsPagePromo: async ctx => {
    const programs = await strapi
      .query('product')
      .model.find(
        { published_at: { $ne: null } },
        {
          id: 1,
          title: 1,
          slug: 1,
          studyFormat: 1,
          whatWillYouLearn: 1,
          category: 1,
          study_field: 1
        }
      )
      .populate([
        { path: 'whatWillYouLearn', select: 'string' },
        { path: 'category', select: 'type slug' },
        { path: 'study_field', select: 'id name slug description' }
      ])

    const programsFiltered =
      programs
        ?.filter(program => program?.category?.type === 'mini')
        ?.map(program => ({
          _id: program._id || null,
          id: program.id || null,
          title: program.title || null,
          slug: program.slug || null,
          studyFormat: program.studyFormat || null,
          whatWillYouLearn:
            program.whatWillYouLearn?.map(item => ({
              string: item?.ref?.string || null
            })) || null,
          category: {
            type: program.category?.type || null,
            slug: program.category?.slug || null
          }
          // study_field: {
          //   id: program.study_field?.id || null,
          //   name: program.study_field?.name || null,
          //   slug: program.study_field?.slug || null,
          //   description: program.study_field?.description || null
          // }
        })) || []

    return { programs: programsFiltered }
  },
  getStaticPropsProgram: async ctx => {
    const typeSlug = ctx?.request?.url?.split('/')?.[3] || 'mini'
    const programSlug = ctx?.request?.url?.split('/')?.[4] || 'program'

    const programs = await strapi
      .query('product')
      .model.find(
        { published_at: { $ne: null } },
        {
          id: 1,
          title: 1,
          slug: 1,
          studyFormat: 1,
          category: 1,
          study_field: 1
        }
      )
      .populate([
        { path: 'category', select: 'type slug' },
        { path: 'study_field', select: 'id name slug description' }
      ])

    const programsFiltered =
      programs
        ?.filter(program => program)
        ?.map(program => ({
          _id: program._id || null,
          id: program.id || null,
          title: program.title || null,
          slug: program.slug || null,
          studyFormat: program.studyFormat || null,
          category: {
            type: program.category?.type || null,
            slug: program.category?.slug || null
          },
          study_field: {
            id: program.study_field?.id || null,
            name: program.study_field?.name || null,
            slug: program.study_field?.slug || null,
            description: program.study_field?.description || null
          }
        })) || []

    const programsProgram = await strapi
      .query('product')
      .model.find(
        {
          published_at: { $ne: null },
          slug: programSlug
        },
        {
          id: 1,
          title: 1,
          slug: 1,
          studyFormat: 1,
          category: 1,
          study_field: 1,
          picture: 1,
          whatWillYouLearn: 1,
          specializedSubjects: 1,
          goal: 1,
          description: 1,
          duration: 1,
          price: 1,
          discount: 1,
          baseSubjects: 1,
          subjectsStickerType: 1,
          programModulesCounters: 1,
          diplomas: 1,
          whoIsFor: 1,
          specializedSubjectsAddons: 1,
          teachers: 1,
          questions: 1,
          reviews: 1
        }
      )
      .populate([
        { path: 'category', select: 'type slug' },
        { path: 'study_field', select: 'id name slug description' },
        { path: 'picture', select: 'url width height' },
        { path: 'whatWillYouLearn', select: 'string' },
        { path: 'specializedSubjects', select: 'string title' },
        { path: 'duration', select: 'studyHours minStudyMonths' },
        { path: 'baseSubjects', select: 'string title' },
        { path: 'programModulesCounters', select: 'leftCounter rightCounter' },
        { path: 'diplomas', select: 'diploma name' },
        { path: 'whoIsFor', select: 'name description' },
        {
          path: 'specializedSubjectsAddons',
          select: 'Practice OfflineModule diplomaProtection'
        },
        {
          path: 'teachers',
          select: 'name description slug portrait descriptionItems'
        },
        {
          path: 'questions',
          select: 'question answer'
        },
        {
          path: 'reviews',
          select: 'picture name desc story'
        }
      ])

    const programFiltered =
      programsProgram
        .filter(program => program?.category?.type === typeSlug)
        ?.map(program => ({
          _id: program._id || null,
          id: program.id || null,
          title: program.title || null,
          slug: program.slug || null,
          studyFormat: program.studyFormat || null,
          category: {
            type: program.category?.type || null,
            slug: program.category?.slug || null
          },
          study_field: {
            id: program.study_field?.id || null,
            name: program.study_field?.name || null,
            slug: program.study_field?.slug || null,
            description: program.study_field?.description || null
          },
          price: program.price || null,
          discount: program.discount || null,
          duration: {
            minStudyMonths: program.duration?.[0]?.ref?.minStudyMonths || null,
            studyHours: program.duration?.[0]?.ref?.studyHours || null
          },
          whatWillYouLearn:
            program.whatWillYouLearn?.map(item => ({
              string: item?.ref?.string || null
            })) || null,
          picture: {
            url: program.picture?.url || null,
            width: program.picture?.width || null,
            height: program.picture?.height || null
          },
          specializedSubjects:
            program.specializedSubjects?.map(subject => ({
              string: subject?.ref?.string || null,
              title: subject?.ref?.title || null
            })) || null,
          specializedSubjectsAddons:
            program.specializedSubjectsAddons?.map(addon => ({
              Practice: addon?.ref?.Practice || null,
              OfflineModule: addon?.ref?.OfflineModule || null,
              diplomaProtection: addon?.ref?.diplomaProtection || null
            }))?.[0] || null,
          goal: program.goal || null,
          description: program.description || null,
          baseSubjects:
            program.baseSubjects?.map(subject => ({
              string: subject?.ref?.string || null,
              title: subject?.ref?.title || null
            })) || null,
          subjectsStickerType: program.subjectsStickerType || null,
          programModulesCounters:
            program.programModulesCounters?.map(counter => ({
              leftCounter: counter?.ref?.leftCounter || null,
              rightCounter: counter?.ref?.rightCounter || null
            }))?.[0] || null,
          diplomas: program.diplomas || null, // not done
          questions: program.questions || null, // not done
          reviews: program.reviews || null, // not done
          whoIsFor:
            program.whoIsFor?.map(item => ({
              name: item?.ref?.name || null,
              description: item?.ref?.description || null
            })) || null,
          teachers:
            program.teachers?.map(teacher => ({
              name: teacher?.name,
              description: teacher?.description,
              slug: teacher?.slug,
              portrait: {
                url: teacher?.portrait?.url || null,
                width: teacher?.portrait?.width || null,
                height: teacher?.portrait?.height || null
              },
              descriptionItems:
                teacher?.descriptionItems?.map(item => ({
                  item: item?.ref?.item || null
                })) || null
            })) || null
        }))?.[0] || null

    return {
      programs: createBlended(programsFiltered),
      program: programFiltered
    }
  },
  getStaticPropsPrograms: async ctx => {
    const programs = await strapi
      .query('product')
      .model.find(
        { published_at: { $ne: null } },
        {
          id: 1,
          title: 1,
          slug: 1,
          studyFormat: 1,
          price: 1,
          duration: 1,
          category: 1,
          study_field: 1
        }
      )
      .populate([
        { path: 'duration', select: 'minStudyMonths' },
        { path: 'category', select: 'type slug' },
        { path: 'study_field', select: 'id name slug description' }
      ])

    const programsFiltered =
      programs
        ?.filter(program => program)
        ?.map(program => ({
          _id: program._id || null,
          id: program.id || null,
          title: program.title || null,
          slug: program.slug || null,
          studyFormat: program.studyFormat || null,
          price: program.price || null,
          duration:
            program.duration?.map(item => ({
              minStudyMonths: item?.ref?.minStudyMonths || null
            })) || null,
          category: {
            type: program.category?.type || null,
            slug: program.category?.slug || null
          },
          study_field: {
            id: program.study_field?.id || null,
            name: program.study_field?.name || null,
            slug: program.study_field?.slug || null,
            description: program.study_field?.description || null
          }
        })) || []

    return { programs: createBlended(programsFiltered) }
  },
  getStaticPropsTeacher: async ctx => {
    const teacherSlug = ctx?.request?.url?.split('/')?.[3] || 'teacher'

    const programs = await strapi
      .query('product')
      .model.find(
        { published_at: { $ne: null } },
        {
          id: 1,
          title: 1,
          slug: 1,
          studyFormat: 1,
          category: 1,
          study_field: 1
        }
      )
      .populate([
        { path: 'category', select: 'type slug' },
        { path: 'study_field', select: 'id name slug description' }
      ])

    const teachers = await strapi.query('teacher').model.find(
      { published_at: { $ne: null }, slug: teacherSlug },
      {
        name: 1,
        description: 1,
        slug: 1,
        portrait: 1,
        descriptionItems: 1
      }
    )

    const programsFiltered =
      programs
        ?.filter(program => program)
        ?.map(program => ({
          _id: program._id || null,
          id: program.id || null,
          title: program.title || null,
          slug: program.slug || null,
          studyFormat: program.studyFormat || null,
          category: {
            type: program.category?.type || null,
            slug: program.category?.slug || null
          },
          study_field: {
            id: program.study_field?.id || null,
            name: program.study_field?.name || null,
            slug: program.study_field?.slug || null,
            description: program.study_field?.description || null
          }
        })) || []

    const teachersFiltered = teachers
      ?.filter(teacher => teacher)
      .map(teacher => ({
        name: teacher.name || null,
        description: teacher.description || null,
        slug: teacher.slug || null,
        portrait: {
          width: teacher.portrait?.width || null,
          height: teacher.portrait?.height || null,
          url: teacher.portrait?.url || null
        },
        descriptionItems:
          teacher.descriptionItems?.map(item => ({
            item: item?.ref?.item || null
          })) || null
      }))

    return {
      programs: createBlended(programsFiltered),
      teacher: teachersFiltered?.[0] || null
    }
  },
  getStaticPropsTeachers: async ctx => {
    const programs = await strapi
      .query('product')
      .model.find(
        { published_at: { $ne: null } },
        {
          id: 1,
          title: 1,
          slug: 1,
          studyFormat: 1,
          category: 1,
          study_field: 1
        }
      )
      .populate([
        { path: 'category', select: 'type slug' },
        { path: 'study_field', select: 'id name slug description' }
      ])

    const teachers = await strapi.query('teacher').model.find(
      { published_at: { $ne: null } },
      {
        name: 1,
        description: 1,
        slug: 1,
        portrait: 1,
        descriptionItems: 1
      }
    )

    const programsFiltered =
      programs
        ?.filter(program => program)
        ?.map(program => ({
          _id: program._id || null,
          id: program.id || null,
          title: program.title || null,
          slug: program.slug || null,
          studyFormat: program.studyFormat || null,
          category: {
            type: program.category?.type || null,
            slug: program.category?.slug || null
          },
          study_field: {
            id: program.study_field?.id || null,
            name: program.study_field?.name || null,
            slug: program.study_field?.slug || null,
            description: program.study_field?.description || null
          }
        })) || []

    const teachersFiltered =
      teachers
        ?.filter(teacher => teacher)
        .map(teacher => ({
          name: teacher.name || null,
          description: teacher.description || null,
          slug: teacher.slug || null,
          portrait: {
            width: teacher.portrait?.width || null,
            height: teacher.portrait?.height || null,
            url: teacher.portrait?.url || null
          },
          descriptionItems:
            teacher.descriptionItems?.map(item => ({
              item: item?.ref?.item || null
            })) || null
        })) || []

    return {
      programs: createBlended(programsFiltered),
      teachers: teachersFiltered
    }
  }
}
