'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { createBlended } = require('../../../helpers/index')

module.exports = {
  default: async ctx => {
    try {
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
    } catch (err) {
      console.log(err)
      return { programs: null }
    }
  },
  getStaticPropsPageJournalArticle: async ctx => {
    try {
      const journalSlug = ctx?.request?.url?.split('/')?.[3]

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
            ...(program.study_field
              ? {
                  study_field: {
                    id: program.study_field?.id || null,
                    name: program.study_field?.name || null,
                    slug: program.study_field?.slug || null,
                    description: program.study_field?.description || null
                  }
                }
              : {})
          })) || []

      const journalArticles = await strapi
        .query('journal-article')
        .model.find(
          { published_at: { $ne: null }, slug: journalSlug },
          {
            title: 1,
            slug: 1,
            createdAt: 1,
            shortDescription: 1,
            isHighlighted: 1,
            picture: 1,
            journal_category: 1,
            journal_tag: 1,
            journalAuthors: 1,
            articleBody: 1
          }
        )
        .populate([
          { path: 'picture', select: 'url width height alternativeText' },
          { path: 'journal_category', select: 'title slug' },
          { path: 'journal_tag', select: 'title slug' }
        ])

      const journalArticleFiltered = journalArticles
        ?.filter(journalArticle => journalArticle)
        ?.map(journalArticle => ({
          title: journalArticle.title || null,
          slug: journalArticle.slug || null,
          createdAt: journalArticle.createdAt || null,
          ...(journalArticle.isHighlighted
            ? {
                isHighlighted: journalArticle.isHighlighted || null,
                shortDescription: journalArticle.shortDescription || null
              }
            : {}),
          picture: {
            url: journalArticle.picture?.url || null,
            width: journalArticle.picture?.width || null,
            height: journalArticle.picture?.height || null,
            alt: journalArticle.picture?.alternativeText || null
          },
          journalCategory: {
            title: journalArticle.journal_category?.title || null,
            slug: journalArticle.journal_category?.slug || null
          },
          journalTag: {
            title: journalArticle.journal_tag?.title || null,
            slug: journalArticle.journal_tag?.slug || null
          },
          journalAuthors:
            journalArticle.journalAuthors?.map(journalAuthor => ({
              label: journalAuthor?.ref?.label || null,
              firstName: journalAuthor?.ref?.firstName || null,
              lastName: journalAuthor?.ref?.lastName || null,
              portrait: {
                url: journalAuthor?.ref?.portrait?.url || null,
                width: journalAuthor?.ref?.portrait?.width || null,
                height: journalAuthor?.ref?.portrait?.height || null
              }
            })) || null,
          articleBody:
            journalArticle.articleBody?.map(component => ({
              __typename: component?.kind || null,
              ...(component?.kind === 'ComponentJournalParagraph'
                ? {
                    paragraphBodyParts:
                      component?.ref?.paragraphBody?.map(item => ({
                        title: item?.title || null,
                        text: item?.text || null,
                        ...(item?.isLarger ? { isLarger: item?.isLarger } : {})
                      })) || null
                  }
                : {}),
              ...(component?.kind === 'ComponentJournalTitle'
                ? {
                    titleBodyParts:
                      component?.ref?.titleBody?.map(item => ({
                        text: item?.text || null,
                        ...(item?.isHighlighted
                          ? { isHighlighted: item?.isHighlighted }
                          : {})
                      })) || null
                  }
                : {}),
              ...(component?.kind === 'ComponentGeneralPicture'
                ? {
                    picture: {
                      url: component?.ref?.picture?.url || null,
                      width: component?.ref?.picture?.width || null,
                      height: component?.ref?.picture?.height || null,
                      alt: component?.ref?.picture.alternativeText || null
                    }
                  }
                : {}),
              ...(component?.kind === 'ComponentJournalEmphasis'
                ? {
                    emphasisBody: component?.ref?.emphasisBody || null
                  }
                : {}),
              ...(component?.kind === 'ComponentJournalQuote'
                ? {
                    quote: {
                      body: component?.ref?.body || null,
                      athorPosition: component?.ref?.athorPosition || null,
                      authorName: component?.ref?.authorName || null,
                      title: component?.ref?.title || null
                    }
                  }
                : {}),
              ...(component?.kind === 'ComponentJournalList'
                ? {
                    list: component?.ref?.listItem?.map(item => ({
                      title: component?.ref?.title || null,
                      body: component?.ref?.body || null
                    }))
                  }
                : {}),
              ...(component?.kind === 'ComponentJournalConclusion'
                ? {
                    conclusion: component?.ref?.item?.map(item => ({
                      title: item?.title || null,
                      body: item?.body || null
                    }))
                  }
                : {}),
              ...(component?.kind ===
              'ComponentJournalJournalRecommendedProgram'
                ? {
                    program: component?.ref?.item?.map(item => ({
                      title: item?.title || null,
                      studyFormat: item?.studyFormat || null,
                      whatWillYouLearn: item?.whatWillYouLearn || null
                    }))
                  }
                : {})
            })) || null
        }))?.[0]

      return {
        programs: programsFiltered,
        journalArticle: journalArticles?.[0]
      }
    } catch (err) {
      console.log(err)
      return {
        programs: null,
        journalArticle: null
      }
    }
  },
  getStaticPropsPageJournalArticles: async ctx => {
    try {
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
            ...(program.study_field
              ? {
                  study_field: {
                    name: program.study_field?.name || null,
                    slug: program.study_field?.slug || null,
                    description: program.study_field?.description || null
                  }
                }
              : {})
          })) || []

      const journalCategories = await strapi
        .query('journal-category')
        .model.find(
          { published_at: { $ne: null } },
          {
            id: 1,
            title: 1,
            slug: 1
          }
        )

      const journalCategoriesFiltered = journalCategories
        ?.filter(journalCategory => journalCategory)
        ?.map(journalCategory => ({
          title: journalCategory.title || null,
          slug: journalCategory.slug || null
        }))

      const journalArticles = await strapi
        .query('journal-article')
        .model.find(
          { published_at: { $ne: null } },
          {
            title: 1,
            slug: 1,
            createdAt: 1,
            shortDescription: 1,
            isHighlighted: 1,
            picture: 1,
            journal_category: 1
          }
        )
        .populate([
          { path: 'picture', select: 'url width height alternativeText' },
          { path: 'journal_category', select: 'title slug' }
        ])

      const journalArticlesFiltered = journalArticles
        ?.filter(journalArticle => journalArticle)
        ?.map(journalArticle => ({
          title: journalArticle.title || null,
          slug: journalArticle.slug || null,
          createdAt: journalArticle.createdAt || null,
          ...(journalArticle.isHighlighted
            ? {
                isHighlighted: journalArticle.isHighlighted || null,
                shortDescription: journalArticle.shortDescription || null
              }
            : {}),
          picture: {
            url: journalArticle.picture?.url || null,
            width: journalArticle.picture?.width || null,
            height: journalArticle.picture?.height || null,
            alt: journalArticle.picture?.alternativeText || null
          },
          journalCategory: {
            title: journalArticle.journal_category?.title || null,
            slug: journalArticle.journal_category?.slug || null
          }
        }))

      return {
        programs: programsFiltered,
        journalCategories: journalCategoriesFiltered,
        journalArticles: journalArticlesFiltered
      }
    } catch (err) {
      console.log(err)
      return {
        programs: null,
        journalCategories: null,
        journalArticles: null
      }
    }
  },
  getStaticPropsPagePromo: async ctx => {
    try {
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
    } catch (err) {
      console.log(err)
      return { programs: null }
    }
  },
  getStaticPropsProgram: async ctx => {
    try {
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
          {
            path: 'programModulesCounters',
            select: 'leftCounter rightCounter'
          },
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
              minStudyMonths:
                program.duration?.[0]?.ref?.minStudyMonths || null,
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
    } catch (err) {
      console.log(err)
      return { programs: null, program: null }
    }
  },
  getStaticPropsPrograms: async ctx => {
    try {
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
            duration: {
              minStudyMonths: program.duration?.[0]?.ref?.minStudyMonths || null
            },
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
    } catch (err) {
      console.log(err)
      return { programs: null }
    }
  },
  getStaticPropsTeacher: async ctx => {
    try {
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
    } catch (err) {
      console.log(err)
      return { programs: null, teacher: null }
    }
  },
  getStaticPropsTeachers: async ctx => {
    try {
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

      const teachers = await strapi
        .query('teacher')
        .model.find(
          { published_at: { $ne: null } },
          {
            name: 1,
            description: 1,
            slug: 1,
            portrait: 1,
            descriptionItems: 1,
            programs: 1
          }
        )
        .populate([{ path: 'programs', select: 'title' }])

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
              })) || null,
            programs: teacher.programs?.map(program => program?.title) || null
          })) || []

      return {
        programs: createBlended(programsFiltered),
        teachers: teachersFiltered
      }
    } catch (err) {
      console.log(err)
      return { programs: null, teachers: null }
    }
  }
}
