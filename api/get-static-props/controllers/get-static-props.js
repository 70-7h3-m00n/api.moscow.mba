"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { createBlended } = require("../../../helpers/index");
const util = require("util");
const axios = require("axios");

module.exports = {
  default: async (ctx) => {
    try {
      const programs = await strapi
        .query("product")
        .find({ id_ne: null, _limit: -1 });

      const programsFiltered =
        programs
          ?.filter(
            (program) =>
              program.published_at !== null && program.isActive === true
          )
          ?.map((program) => ({
            _id: program.id || null,
            id: program.id || null,
            title: program.title || null,
            slug: program.slug || null,
            studyFormat: program.studyFormat || null,
            isActive: program.isActive || null,
            category: {
              type: program.category?.type || null,
              slug: program.category?.slug || null,
            },
            study_field: {
              id: program.study_field?.id || null,
              name: program.study_field?.name || null,
              slug: program.study_field?.slug || null,
              description: program.study_field?.description || null,
            },
          })) || [];

      const untilDates = await strapi
        .query("until")
        .find({ published_at_ne: null });

      const untilDatesFiltered = [
        untilDates?.[0]?.January,
        untilDates?.[0]?.February,
        untilDates?.[0]?.March,
        untilDates?.[0]?.April,
        untilDates?.[0]?.May,
        untilDates?.[0]?.June,
        untilDates?.[0]?.July,
        untilDates?.[0]?.August,
        untilDates?.[0]?.September,
        untilDates?.[0]?.October,
        untilDates?.[0]?.November,
        untilDates?.[0]?.December,
      ];

      return {
        until: untilDatesFiltered,
        programs: createBlended(programsFiltered),
      };
    } catch (err) {
      console.log(err);
      return { programs: null };
    }
  },
  getStaticPropsPageJournalArticle: async (ctx) => {
    try {
      const journalSlug = ctx?.request?.url?.split("/")?.[3];

      const programs = await strapi
        .query("product")
        .find({ id_ne: null, _limit: -1 });

      const programsFiltered =
        programs
          ?.filter((program) => program.published_at !== null)
          ?.map((program) => ({
            _id: program.id || null,
            id: program.id || null,
            title: program.title || null,
            slug: program.slug || null,
            studyFormat: program.studyFormat || null,
            isActive: program.isActive || null,
            category: {
              type: program.category?.type || null,
              slug: program.category?.slug || null,
            },
            ...(program.study_field
              ? {
                  study_field: {
                    id: program.study_field?.id || null,
                    name: program.study_field?.name || null,
                    slug: program.study_field?.slug || null,
                    description: program.study_field?.description || null,
                  },
                }
              : {}),
          })) || [];

      const programCategories = programs
        ?.filter((program) => program.published_at !== null)
        ?.reduce(
          (acc, cur) =>
            !acc.some((item) => item?.id === cur?.category?.id)
              ? [
                  ...acc,
                  {
                    id: cur?.category?.id,
                    type: cur?.category?.type,
                    slug: cur?.category?.slug,
                  },
                ]
              : acc,
          []
        );

      const journalArticles = await strapi
        .query("journal-article")
        .find({ published_at_ne: null, slug: journalSlug, _limit: -1 });

      const journalArticle =
        journalArticles?.filter(
          (journalArticle) => journalArticle.published_at !== null
        )?.[0] || null;

      const journalArticleCategories = await strapi
        .query("journal-category")
        .find({ published_at_ne: null });

      const fetchTable = async (url) => {
        try {
          const res = await axios.get(url);
          const data = await res.data;
          return data;
        } catch (err) {
          console.log(err);
          return null;
        }
      };

      const bodyArticleHtmlTables = journalArticle?.articleBody?.map((item) =>
        item?.__component === "journal.journal-table" ? item?.htmlTable : null
      );

      const getHtmlTableBodyTable = async () => {
        const data = await Promise.all(
          bodyArticleHtmlTables.map(async (item) =>
            item ? { table: await fetchTable(item?.url) } : null
          )
        );
        return data;
      };

      const htmlTableBodyTable = await getHtmlTableBodyTable();

      // console.log('htmlTableBodyTable: ', htmlTableBodyTable)

      const journalArticleFiltered = {
        title: journalArticle.title || null,
        slug: journalArticle.slug || null,
        shortDescription: journalArticle.shortDescription || null,
        createdAt: journalArticle.created_at || null,
        metaTitle: journalArticle.metaTitle || null,
        publicationDate: journalArticle.publicationDate || null,
        metaDescription: journalArticle.metaDescription || null,
        noindex:
          journalArticle.noindex === false
            ? false
            : journalArticle.noindex === true
            ? true
            : null,
        nofollow:
          journalArticle.nofollow === false
            ? false
            : journalArticle.nofollow === true
            ? true
            : null,
        picture: {
          url: journalArticle.picture?.url || null,
          width: journalArticle.picture?.width || null,
          height: journalArticle.picture?.height || null,
          alt: journalArticle.picture?.alternativeText || null,
        },
        pdfMaterials:
          journalArticle.pdfMaterials?.map((pdfMaterial) => ({
            url: pdfMaterial?.url || null,
            name: pdfMaterial?.name || null,
            ...(pdfMaterial?.alternativeText
              ? { alt: pdfMaterial?.alternativeText }
              : {}),
          })) || [],
        journalCategory:
          {
            title: journalArticle.journal_category?.title || null,
            slug: journalArticle.journal_category?.slug || null,
          } || null,
        // journalTags:
        //   journalArticle.journal_tags?.map(journalTag => ({
        //     title: journalTag?.title || null,
        //     slug: journalTag?.slug || null
        //   })) || [],
        journalAuthors:
          journalArticle.journal_authors?.map((journalAuthor) => {
            return {
              ...(journalAuthor?.label ? { label: journalAuthor?.label } : {}),
              label: journalAuthor?.label || null,
              authorPosition: journalAuthor?.authorPosition || null,
              // firstName: journalAuthor?.firstName || null,
              // lastName: journalAuthor?.lastName || null,
              authorName:
                `${journalAuthor?.firstName} ${journalAuthor?.lastName}` ||
                null,
              portrait: {
                url: journalAuthor?.portrait?.url || null,
                width: journalAuthor?.portrait?.width || null,
                height: journalAuthor?.portrait?.height || null,
                ...(journalAuthor?.portrait?.alternativeText
                  ? {
                      alt: journalAuthor?.portrait?.alternativeText,
                    }
                  : {}),
              },
            };
          }) || [],
        recommendedPrograms:
          journalArticle.programs?.map((program) => ({
            title: program?.title || null,
            slug: program?.slug || null,
            categorySlug:
              programCategories.find((programCategory) => {
                return (
                  programCategory?.id?.toString()?.trim()?.toLowerCase() ===
                  program?.category?.toString()?.trim()?.toLowerCase()
                );
              })?.slug || null,
            studyFormatSlug: program?.studyFormat || null,
            icon: program?.icon || null,
          })) || [],
        articleBody:
          journalArticle.articleBody?.map((component, idx) => {
            // console.log("component: ", component.__component);
            // console.log(
            //   util.inspect(component, {
            //     showHidden: false,
            //     depth: null,
            //     colors: true
            //   })
            // )

            return {
              __typename: component?.__component || null,
              ...(component?.__component === "journal.paragraph"
                ? {
                    paragraphBodyParts:
                      component?.paragraphBody?.map((item) => ({
                        text: item?.text || null,
                        ...(item?.isLarger
                          ? {
                              isLarger: item?.isLarger,
                            }
                          : {}),
                        ...(item?.isHighlighted
                          ? {
                              isHighlighted: item?.isHighlighted,
                            }
                          : {}),
                      })) || [],
                  }
                : {}),
              ...(component?.__component === "journal.title"
                ? {
                    title: {
                      titleBodyParts:
                        component?.titleBody?.map((item) => ({
                          text: item?.text || null,
                          ...(item?.isHighlighted
                            ? {
                                isHighlighted: item?.isHighlighted,
                              }
                            : {}),
                        })) || [],
                      hType: component?.hType || null,
                    },
                  }
                : {}),
              ...(component?.__component === "general.picture"
                ? {
                    picture: {
                      url: component?.picture?.url || null,
                      width: component?.picture?.width || null,
                      height: component?.picture?.height || null,
                      ...(component?.portrait?.alternativeText
                        ? {
                            alt: component?.portrait?.alternativeText,
                          }
                        : {}),
                      title: component?.title || null,
                    },
                  }
                : {}),
              ...(component?.__component === "journal.emphasis"
                ? {
                    emphasisBody: component?.emphasisBody || null,
                  }
                : {}),
              ...(component?.__component === "journal.form-pdf-materials"
                ? {
                    formPdfMaterials: {
                      title: component?.title || null,
                    },
                  }
                : {}),
              ...(component?.__component === "journal.journal-table"
                ? {
                    htmlTableBody: {
                      // name: component?.ref?.htmlTable?.name || null,
                      // url: component?.ref?.htmlTable?.url || null,
                      // ...(component?.ref?.htmlTableBody?.alternativeText
                      //   ? {
                      //       alt: component?.ref?.htmlTableBody?.alternativeText
                      //     }
                      //   : {}),
                      table: htmlTableBodyTable?.[idx]?.table || null,
                    },
                  }
                : {}),
              ...(component?.__component === "journal.quote"
                ? {
                    quote: {
                      body: component?.body || null,
                      label: component?.label || null, // * not in the strapi yet
                      authorPosition: component?.athorPosition || null,
                      authorName: component?.authorName || null,
                      portrait: {
                        url: component?.portrait?.url || null,
                        width: component?.portrait?.width || null,
                        height: component?.portrait?.height || null,
                        ...(component?.portrait?.alternativeText
                          ? {
                              alt: component?.portrait?.alternativeText,
                            }
                          : {}),
                      },
                    },
                  }
                : {}),
              ...(component?.__component ===
              "journal.journal-recommended-articles"
                ? {
                    journalRecommendedArticles: {
                      title: component?.title || null,
                      articles:
                        component?.jrnl_articles?.map((journalArticle) => ({
                          title: journalArticle?.title || null,
                          slug: journalArticle?.slug || null,
                        })) || [],
                    },
                  }
                : {}),
              ...(component?.__component === "journal.read-also-articles"
                ? {
                    journalReadAlsoArticles: {
                      title: component?.title || null,
                      articles:
                        component?.jrnl_articles
                          ?.filter(
                            (item) => item
                            // &&
                            // journalArticle?.articleBody
                            //   .filter(
                            //     component =>
                            //       component?.kind ===
                            //       'ComponentJournalJournalRecommendedArticles'
                            //   )
                            //   .map(piece => piece?.ref?.title)
                            //   .some(title => title === item?.title)
                          )
                          .map((article) => ({
                            title: article?.title || null,
                            slug: article?.slug || null,
                            createdAt: article.createdAt || null,
                            picture: {
                              url: article?.picture?.url || null,
                              width: article?.picture?.width || null,
                              height: article?.picture?.height || null,
                              alt: article?.picture?.alternativeText || null,
                            },
                            journalCategory: article?.journal_category
                              ? journalArticleCategories
                                  .filter(
                                    (journalArticleCategory) =>
                                      journalArticleCategory?._id
                                        ?.toString()
                                        ?.trim() ===
                                      article?.journal_category
                                        .toString()
                                        ?.trim()
                                  )
                                  .map((item) => ({
                                    title: item?.title || null,
                                    slug: item?.slug || null,
                                  }))?.[0]
                              : null,
                          })) || [],
                    },
                  }
                : {}),
              ...(component?.__component ===
              "journal.journal-recommended-programs"
                ? {
                    recommendedProgram: {
                      title: component?.title || null,
                      btnValue: component?.btnValue || null,
                      program: {
                        title: component?.program?.title || null,
                        slug: component?.program?.slug || null,
                        categorySlug:
                          component?.program?.category?.slug ||
                          programCategories.find((programCategory) => {
                            return (
                              programCategory?.id
                                ?.toString()
                                ?.trim()
                                ?.toLowerCase() ===
                              component?.program?.category
                                ?.toString()
                                ?.trim()
                                ?.toLowerCase()
                            );
                          })?.slug ||
                          null,
                        studyFormatSlug:
                          component?.program?.studyFormat || null,
                        icon: component?.program?.icon || null,
                      },
                    },
                  }
                : {}),
              ...(component?.__component === "journal.list"
                ? {
                    list: {
                      items: component?.listItem?.map((item) => ({
                        body: item?.body || null,
                      })),
                      tag: component?.tag || null,
                    },
                  }
                : {}),
              ...(component?.__component === "journal.conclusion"
                ? {
                    conclusion:
                      component?.item?.map((item) => ({
                        title: item?.title || null,
                        body: item?.body || null,
                      })) || [],
                  }
                : {}),
              ...(component?.__component ===
              "journal.journal-article-recommended-programs-section"
                ? {
                    recommendedProgramsSection: {
                      btnVal: component?.btnVal || null,
                      title:
                        component?.sectionTitle.map((item) => ({
                          titlePart: item?.text || null,
                          isHighlighted: item?.isHighlighted || null,
                        })) || [],
                      shortTextAtTheBottom:
                        component?.shortTextAtTheBottom?.map((item) => ({
                          textPart: item?.text || null,
                          isHighlighted: item?.isHighlighted || null,
                        })) || [],
                      programs: component?.programs?.map((program) => {
                        // console.log('program.category: ', program.category)
                        // console.log('programCategories: ', programCategories)
                        return {
                          title: program?.title || null,
                          slug: program?.slug || null,
                          categorySlug:
                            program?.category?.slug ||
                            programCategories.find(
                              (programCategory) =>
                                programCategory?.id
                                  ?.toString()
                                  ?.trim()
                                  ?.toLowerCase() ===
                                program?.category
                                  ?.toString()
                                  ?.trim()
                                  ?.toLowerCase()
                            )?.slug ||
                            null,
                          studyFormatSlug: program?.studyFormat || null,
                          icon: program?.icon || null,
                        };
                      }),
                    },
                  }
                : {}),
            };
          }) || null,
      };

      return {
        programs: createBlended(programsFiltered),
        journalArticle: journalArticleFiltered,
      };
    } catch (err) {
      console.log(err);
      return {
        programs: null,
        journalArticle: null,
      };
    }
  },
  getStaticPropsPageJournalArticles: async (ctx) => {
    try {
      const programs = await strapi
        .query("product")
        .find({ published_at_ne: null, _limit: -1 });

      const programsFiltered =
        programs
          ?.filter((program) => program.published_at !== null)
          ?.map((program) => ({
            _id: program.id || null,
            id: program.id || null,
            title: program.title || null,
            slug: program.slug || null,
            studyFormat: program.studyFormat || null,
            isActive: program.isActive || null,
            category: {
              type: program.category?.type || null,
              slug: program.category?.slug || null,
            },
            ...(program.study_field
              ? {
                  study_field: {
                    name: program.study_field?.name || null,
                    slug: program.study_field?.slug || null,
                    description: program.study_field?.description || null,
                  },
                }
              : {}),
          })) || [];

      const journalCategories = await strapi
        .query("journal-category")
        .find({ published_at_ne: null });

      const journalCategoriesFiltered =
        journalCategories
          ?.filter((journalCategory) => journalCategory.published_at !== null)
          ?.map((journalCategory) => ({
            title: journalCategory.title || null,
            slug: journalCategory.slug || null,
          })) || [];

      const journalArticles = await strapi
        .query("journal-article")
        .find({ published_at_ne: null, _limit: -1 });

      const journalArticlesFiltered =
        journalArticles
          ?.filter((journalArticle) => journalArticle.published_at !== null)
          ?.map((journalArticle) => ({
            title: journalArticle.title || null,
            slug: journalArticle.slug || null,
            createdAt: journalArticle.created_at || null,
            publicationDate: journalArticle.publicationDate || null,
            shortDescription: journalArticle.shortDescription || null,
            metaDescription: journalArticle.metaDescription || null,
            picture: {
              url: journalArticle.picture?.url || null,
              width: journalArticle.picture?.width || null,
              height: journalArticle.picture?.height || null,
              alt: journalArticle.picture?.alternativeText || null,
            },
            journalCategory: {
              title: journalArticle.journal_category?.title || null,
              slug: journalArticle.journal_category?.slug || null,
            },
          }))
          .sort(
            (prev, next) =>
              new Date(next.createdAt).getTime() -
              new Date(prev.createdAt).getTime()
          ) || [];

      return {
        // test: journalArticles,
        programs: createBlended(programsFiltered),
        journalCategories: journalCategoriesFiltered,
        journalArticles: journalArticlesFiltered,
      };
    } catch (err) {
      console.log(err);
      return {
        programs: null,
        journalCategories: null,
        journalArticles: null,
      };
    }
  },
  getStaticPropsPagePromo: async (ctx) => {
    try {
      //POSTGRES
      const programs = await strapi
        .query("product")
        .find({ published_at_ne: null, _limit: -1 });

      // const programs = await strapi
      //   .query("product")
      //   .model.find(
      //     { published_at: { $ne: null } },
      //     {
      //       id: 1,
      //       title: 1,
      //       slug: 1,
      //       studyFormat: 1,
      //       whatWillYouLearn: 1,
      //       category: 1,
      //       study_field: 1,
      //     }
      //   )
      //   .populate([
      //     { path: "whatWillYouLearn", select: "string" },
      //     { path: "category", select: "type slug" },
      //     { path: "study_field", select: "id name slug description" },
      //   ]);

      const programsFiltered =
        programs
          ?.filter((program) => program?.category?.type === "mini")
          ?.map((program) => ({
            _id: program.id || null,
            id: program.id || null,
            title: program.title || null,
            slug: program.slug || null,
            studyFormat: program.studyFormat || null,
            isActive: program.isActive || null,
            whatWillYouLearn:
              program.whatWillYouLearn?.map((item) => ({
                string: item?.string || null,
              })) || null,
            category: {
              type: program.category?.type || null,
              slug: program.category?.slug || null,
            },
            // study_field: {
            //   id: program.study_field?.id || null,
            //   name: program.study_field?.name || null,
            //   slug: program.study_field?.slug || null,
            //   description: program.study_field?.description || null
            // }
          })) || [];

      return { programs: programsFiltered };
    } catch (err) {
      console.log(err);
      return { programs: null };
    }
  },
  getStaticPropsProgram: async (ctx) => {
    try {
      const typeSlug = ctx?.request?.url?.split("/")?.[3] || "mini";
      const programSlug = ctx?.request?.url?.split("/")?.[4] || "program";

      const programs = await strapi
        .query("product")
        .find({ published_at_ne: null, _limit: -1 });

      const programsFiltered =
        programs
          ?.filter((program) => program.published_at !== null)
          ?.map((program) => ({
            _id: program.id || null,
            id: program.id || null,
            title: program.title || null,
            slug: program.slug || null,
            studyFormat: program.studyFormat || null,
            isActive: program.isActive || null,
            category: {
              type: program.category?.type || null,
              slug: program.category?.slug || null,
            },
            study_field: {
              id: program.study_field?.id || null,
              name: program.study_field?.name || null,
              slug: program.study_field?.slug || null,
              description: program.study_field?.description || null,
            },
          })) || [];

      const programsProgram = await strapi
        .query("product")
        .find({ published_at_ne: null, slug: programSlug });

      const programFiltered =
        programsProgram
          .filter((program) => program?.category?.type === typeSlug)
          ?.map((program) => ({
            _id: program.id || null,
            id: program.id || null,
            title: program.title || null,
            slug: program.slug || null,
            metaTitle: program.metaTitle || null,
            metaDescription: program.metaDescription || null,
            isActive: program.isActive || null,
            noindex:
              program.noindex === false
                ? false
                : program.noindex === true
                ? true
                : null,
            nofollow:
              program.nofollow === false
                ? false
                : program.nofollow === true
                ? true
                : null,
            studyFormat: program.studyFormat || null,
            category: {
              type: program.category?.type || null,
              slug: program.category?.slug || null,
            },
            study_field: {
              id: program.study_field?.id || null,
              name: program.study_field?.name || null,
              slug: program.study_field?.slug || null,
              description: program.study_field?.description || null,
            },
            price: program.price || null,
            discount: program.discount || null,
            duration: {
              minStudyMonths: program.duration?.minStudyMonths || null,
              studyHours: program.duration?.studyHours || null,
              practicalLessons: program.duration?.practicalLessons || null,
            },
            whatWillYouLearn:
              program.whatWillYouLearn?.map((item) => ({
                string: item?.string || null,
              })) || null,
            whatWillYouLearnPhoto: program.whatWillYouLearnPhoto?.url || null,
            prosPhoto: program.prosPhoto?.url || null,
            picture: {
              url: program.picture?.url || null,
              width: program.picture?.width || null,
              height: program.picture?.height || null,
            },
            specializedSubjects:
              program.specializedSubjects?.map((subject) => ({
                string: subject?.string || null,
                title: subject?.title || null,
              })) || null,
            specializedSubjectsAddons: {
              Practice: program.specializedSubjectsAddons?.Practice || null,
              OfflineModule:
                program.specializedSubjectsAddons?.OfflineModule || null,
              diplomaProtection:
                program.specializedSubjectsAddons?.diplomaProtection || null,
            },
            goal: program.goal || null,
            actualInformation: program.actualInformation || null,
            description: program.description || null,
            baseSubjects:
              program.baseSubjects?.map((subject) => ({
                string: subject?.string || null,
                title: subject?.title || null,
              })) || null,
            subjectsStickerType: program.subjectsStickerType || null,
            programModulesCounters: {
              leftCounter: program.programModulesCounters?.leftCounter || null,
              rightCounter:
                program.programModulesCounters?.rightCounter || null,
            },
            // program.programModulesCounters?.map((counter) => ({
            //   leftCounter: counter?.ref?.leftCounter || null,
            //   rightCounter: counter?.ref?.rightCounter || null,
            // }))?.[0] || null,
            diplomas: program.diplomas || null, // not done
            questions: program.questions || null, // not done
            reviews: program.reviews || null, // not done
            whoIsFor:
              program.whoIsFor?.map((item) => ({
                name: item?.name || null,
                description: item?.description || null,
              })) || null,
            teachers:
              program.teachers
                ?.filter((teacher) => teacher.published_at !== null)
                .map((teacher) => ({
                  name: teacher?.name,
                  description: teacher?.description,
                  slug: teacher?.slug,
                  portrait: {
                    url: teacher?.portrait?.url || null,
                    width: teacher?.portrait?.width || null,
                    height: teacher?.portrait?.height || null,
                  },
                  descriptionItems:
                    teacher?.descriptionItems?.map((item) => ({
                      item: item?.item || null,
                    })) || null,
                })) || null,
          }))?.[0] || null;

      const untilDates = await strapi
        .query("until")
        .find({ published_at_ne: null });

      const untilDatesFiltered = [
        untilDates?.[0]?.January,
        untilDates?.[0]?.February,
        untilDates?.[0]?.March,
        untilDates?.[0]?.April,
        untilDates?.[0]?.May,
        untilDates?.[0]?.June,
        untilDates?.[0]?.July,
        untilDates?.[0]?.August,
        untilDates?.[0]?.September,
        untilDates?.[0]?.October,
        untilDates?.[0]?.November,
        untilDates?.[0]?.December,
      ];

      return {
        // test: programsProgram,
        until: untilDatesFiltered,
        programs: createBlended(programsFiltered),
        program: programFiltered,
      };
    } catch (err) {
      console.log(err);
      return { programs: null, program: null };
    }
  },
  getStaticPropsPrograms: async (ctx) => {
    try {
      const programs = await strapi
        .query("product")
        .find({ published_at_ne: null, _limit: -1 });

      const programsFiltered =
        programs

          ?.filter(
            (program) =>
              program.published_at !== null && program.isActive === true
          )
          ?.map((program) => ({
            _id: program.id || null,
            id: program.id || null,
            title: program.title || null,
            slug: program.slug || null,
            studyFormat: program.studyFormat || null,
            price: program.price || null,
            updatedAt: program.updated_at || null,
            isActive: program.isActive || null,
            duration: {
              minStudyMonths: program.duration?.minStudyMonths || null,
              studyHours: program.duration?.studyHours || null,
            },
            category: {
              type: program.category?.type || null,
              slug: program.category?.slug || null,
            },
            study_field: {
              id: program.study_field || null,
              name: program.study_field?.name || null,
              slug: program.study_field?.slug || null,
              description: program.study_field?.description || null,
            },
          })) || [];

      const untilDates = await strapi
        .query("until")
        .find({ published_at_ne: null });

      const untilDatesFiltered = [
        untilDates?.[0]?.January,
        untilDates?.[0]?.February,
        untilDates?.[0]?.March,
        untilDates?.[0]?.April,
        untilDates?.[0]?.May,
        untilDates?.[0]?.June,
        untilDates?.[0]?.July,
        untilDates?.[0]?.August,
        untilDates?.[0]?.September,
        untilDates?.[0]?.October,
        untilDates?.[0]?.November,
        untilDates?.[0]?.December,
      ];

      return {
        until: untilDatesFiltered,
        programs: createBlended(programsFiltered),
      };
    } catch (err) {
      console.log(err);
      return { programs: null };
    }
  },
  getStaticPropsTeacher: async (ctx) => {
    try {
      const teacherSlug = ctx?.request?.url?.split("/")?.[3] || "teacher";

      const teachers = await strapi
        .query("teacher")
        .find({ published_at_ne: null, slug: teacherSlug });

      const programs = await strapi
        .query("product")
        .find({ published_at_ne: null, _limit: -1 });

      const programsFiltered =
        programs
          ?.filter((program) => program.published_at !== null)
          ?.map((program) => ({
            _id: program.id || null,
            id: program.id || null,
            title: program.title || null,
            slug: program.slug || null,
            studyFormat: program.studyFormat || null,
            category: {
              type: program.category?.type || null,
              slug: program.category?.slug || null,
            },
            study_field: {
              id: program.study_field?.id || null,
              name: program.study_field?.name || null,
              slug: program.study_field?.slug || null,
              description: program.study_field?.description || null,
            },
          })) || [];

      const teachersFiltered = teachers
        ?.filter((teacher) => teacher.published_at !== null)
        .map((teacher) => ({
          name: teacher.name || null,
          description: teacher.description || null,
          slug: teacher.slug || null,
          portrait: {
            width: teacher.portrait?.width || null,
            height: teacher.portrait?.height || null,
            url: teacher.portrait?.url || null,
          },
          descriptionItems:
            teacher.descriptionItems?.map((item) => ({
              item: item?.item || null,
            })) || null,
        }));

      return {
        programs: createBlended(programsFiltered),
        teacher: teachersFiltered?.[0] || null,
      };
    } catch (err) {
      console.log(err);
      return { programs: null, teacher: null };
    }
  },
  getStaticPropsTeachers: async (ctx) => {
    try {
      const programs = await strapi
        .query("product")
        .find({ id_ne: null, _limit: -1 });

      const teachers = await strapi
        .query("teacher")
        .find({ published_at_ne: null, _limit: -1 });

      const programsFiltered =
        programs
          ?.filter((program) => program)
          ?.map((program) => ({
            _id: program.id || null,
            id: program.id || null,
            title: program.title || null,
            slug: program.slug || null,
            studyFormat: program.studyFormat || null,
            category: {
              type: program.category?.type || null,
              slug: program.category?.slug || null,
            },
            study_field: {
              id: program.study_field?.id || null,
              name: program.study_field?.name || null,
              slug: program.study_field?.slug || null,
              description: program.study_field?.description || null,
            },
          })) || [];

      const teachersFiltered =
        teachers
          ?.filter((teacher) => teacher.published_at !== null)
          .map((teacher) => ({
            name: teacher.name || null,
            description: teacher.description || null,
            slug: teacher.slug || null,
            portrait: {
              width: teacher.portrait?.width || null,
              height: teacher.portrait?.height || null,
              url: teacher.portrait?.url || null,
            },
            descriptionItems:
              teacher.descriptionItems?.map((item) => ({
                item: item?.item || null,
              })) || null,
            programs:
              teacher.programs?.map((program) => program?.title) || null,
          })) || [];

      return {
        programs: createBlended(programsFiltered),
        teachers: teachersFiltered,
      };
    } catch (err) {
      console.log(err);
      return { programs: null, teachers: null };
    }
  },
  getStaticPropsSeminar: async (ctx) => {
    try {
      const seminarSlug = ctx?.request?.url?.split("/")?.[3] || "seminar";

      const programs = await strapi
        .query("product")
        .find({ published_at_ne: null, _limit: -1 });

      const programsFiltered =
        programs
          ?.filter((program) => program.published_at !== null)
          ?.map((program) => ({
            _id: program?.id || null,
            id: program?.id || null,
            title: program.title || null,
            slug: program.slug || null,
            studyFormat: program.studyFormat || null,
            category: {
              type: program.category?.type || null,
              slug: program.category?.slug || null,
            },
            study_field: {
              id: program.study_field?.id || null,
              name: program.study_field?.name || null,
              slug: program.study_field?.slug || null,
              description: program.study_field?.description || null,
            },
          })) || [];

      const seminar = await strapi
        .query("webinars")
        .find({ published_at_ne: null, Slug: seminarSlug });

      const seminarFiltered =
        seminar
          ?.filter((seminar) => seminar.published_at !== null)
          ?.map((seminar) => ({
            id: seminar?.id || null,
            date: new Date(seminar?.date) || null,
            duration: seminar?.seminarDuration || null,
            title: seminar?.title || null,
            slug: seminar?.Slug || null,
            category: {
              id: seminar?.seminar_category?.id || null,
              categoryName: seminar?.seminar_category?.Category || null,
            },
            authors: seminar?.seminar_authors?.map((author) => ({
              name: `${author?.firstName} ${author?.lastName}` || null,
              portrait: author?.portrait[0].url || null,
            })),
            address: seminar?.address || null,
            price: seminar?.price || null,
            description: seminar?.description || null,
            advantagesList: seminar?.advantagesList?.map((item) => item.string),
            pdfMaterials: {
              name: seminar?.SeminarProgramPDF?.name || null,
              url: seminar?.SeminarProgramPDF?.url || null,
            },
          })) || [];

      return {
        test: seminar,
        programs: createBlended(programsFiltered),
        seminar: seminarFiltered?.[0] || null,
      };
    } catch (err) {
      console.log(err);
      return { programs: null, seminar: null };
    }
  },
  getStaticPropsSeminars: async (ctx) => {
    try {
      const programs = await strapi
        .query("product")
        .find({ published_at_ne: null, _limit: -1 });

      const programsFiltered =
        programs
          ?.filter((program) => program.published_at !== null)
          ?.map((program) => ({
            _id: program.id || null,
            id: program.id || null,
            title: program.title || null,
            slug: program.slug || null,
            studyFormat: program.studyFormat || null,
            category: {
              type: program.category?.type || null,
              slug: program.category?.slug || null,
            },
            study_field: {
              id: program.study_field?.id || null,
              name: program.study_field?.name || null,
              slug: program.study_field?.slug || null,
              description: program.study_field?.description || null,
            },
          })) || [];

      const seminarCategories = await strapi
        .query("seminar-categories")
        .find({ published_at_ne: null, _limit: -1 });

      const filteredSeminarCategories = seminarCategories
        ?.filter((category) => category.published_at !== null)
        ?.filter((category) => category?.seminars.length > 0)
        ?.map((category) => ({
          id: category.id,
          categoryName: category?.Category,
          slug: category?.slug,
        }));

      const seminars = await strapi
        .query("webinars")
        .find({ published_at_ne: null, _limit: -1 });

      const seminarsFiltered =
        seminars
          ?.filter((seminar) => seminar.published_at !== null)
          ?.map((seminar) => ({
            id: seminar.id || null,
            date: new Date(seminar.date) || null,
            duration: seminar.seminarDuration || null,
            title: seminar.title || null,
            slug: seminar.Slug || null,
            seminar_categories: seminar.seminar_categories?.map((c) => ({
              id: c.id,
              slug: c.slug,
              name: c.Category,
            })),
            authors: seminar.seminar_authors?.map((author) => ({
              name: `${author.firstName} ${author.lastName}` || null,
              portrait: author.portrait[0].url || null,
            })),
          })) || [];

      return {
        // test: seminars,
        programs: createBlended(programsFiltered),
        seminarCategories: filteredSeminarCategories,
        seminars: seminarsFiltered,
      };
    } catch (err) {
      console.log(err);
      return {
        programs: null,
        seminarCategories: null,
        seminars: null,
      };
    }
  },
  defaultMskAcademy: async (ctx) => {
    const typeSlug = ctx?.request?.url?.split("/")?.[3] || "mini";
    // const programSlug = ctx?.request?.url?.split('/')?.[4] || ''

    try {
      const programs = await strapi
        .query("product")
        .find({ published_at_ne: null, _limit: -1 });

      const programsFiltered =
        programs
          ?.filter((program) => program?.category?.type === typeSlug)
          ?.map((program, id) => ({
            id: program.id || null,
            title: program.title || null,
            slug: program.slug || null,
            isActive: program.isActive || null,
            duration: {
              minStudyMonths:
                Number(programs[id].duration?.minStudyMonths) || null,
            },
            whatWillYouLearn: program.whatWillYouLearn?.map((item) => ({
              string: item?.string || null,
            })),
          })) || [];

      const untilDates = await strapi
        .query("until")
        .find({ published_at_ne: null });

      const untilDatesFiltered = [
        untilDates?.[0]?.January,
        untilDates?.[0]?.February,
        untilDates?.[0]?.March,
        untilDates?.[0]?.April,
        untilDates?.[0]?.May,
        untilDates?.[0]?.June,
        untilDates?.[0]?.July,
        untilDates?.[0]?.August,
        untilDates?.[0]?.September,
        untilDates?.[0]?.October,
        untilDates?.[0]?.November,
        untilDates?.[0]?.December,
      ];

      return {
        until: untilDatesFiltered,
        programs: programsFiltered,
      };
    } catch (err) {
      console.log(err);
      return { programs: null };
    }
  },
  programMskAcademy: async (ctx) => {
    const typeSlug = ctx?.request?.url?.split("/")?.[3] || "mini";
    const programSlug = ctx?.request?.url?.split("/")?.[4] || "";

    try {
      const programsProgram = await strapi.query("product").find({
        published_at_ne: null,
        slug: programSlug,
      });

      const programFiltered =
        programsProgram
          .filter((program) => program?.category?.type === typeSlug)
          ?.map((program, id) => ({
            id: program.id || null,
            title: program.title || null,
            slug: program.slug || null,
            price: programsProgram[id].price || null,
            discount: program.discount || null,
            goal: program.goal || null,
            isActive: program.isActive || null,
            duration: {
              minStudyMonths:
                Number(programsProgram[id].duration?.minStudyMonths) || null,
            },
            whatWillYouLearn:
              program.whatWillYouLearn?.map((item) => ({
                string: item?.string || null,
              })) || null,
            picture: {
              url: program.picture?.url || null,
              width: program.picture?.width || null,
              height: program.picture?.height || null,
              alternativeText: program.picture?.alternativeText || null,
            },
            specializedSubjects:
              program.specializedSubjects?.map((subject) => ({
                string: subject?.string || null,
                title: subject?.title || null,
              })) || null,
            baseSubjects:
              program.baseSubjects?.map((subject) => ({
                string: subject?.string || null,
                title: subject?.title || null,
              })) || null,
            whoIsFor:
              program.whoIsFor?.map((item) => ({
                name: item?.name || null,
                description: item?.description || null,
              })) || null,
            teachers:
              program.teachers?.map((teacher) => ({
                name: teacher?.name,
                description: teacher?.description,
                slug: teacher?.slug,
                portrait: {
                  url: teacher?.portrait?.url || null,
                  width: teacher?.portrait?.width || null,
                  height: teacher?.portrait?.height || null,
                  alternativeText: teacher?.portrait?.alternativeText || null,
                },
                descriptionItems:
                  teacher?.descriptionItems?.map((item) => ({
                    item: item?.item || null,
                  })) || null,
              })) || null,
          })) || null;

      const untilDates = await strapi
        .query("until")
        .find({ published_at_ne: null });

      const untilDatesFiltered = [
        untilDates?.[0]?.January,
        untilDates?.[0]?.February,
        untilDates?.[0]?.March,
        untilDates?.[0]?.April,
        untilDates?.[0]?.May,
        untilDates?.[0]?.June,
        untilDates?.[0]?.July,
        untilDates?.[0]?.August,
        untilDates?.[0]?.September,
        untilDates?.[0]?.October,
        untilDates?.[0]?.November,
        untilDates?.[0]?.December,
      ];

      return {
        until: untilDatesFiltered,
        programs: programFiltered,
      };
    } catch (err) {
      console.log(err);
      return { programs: null };
    }
  },
  sitemap: async (ctx) => {
    try {
      const programs = await strapi
        .query("product")
        .find({ published_at_ne: null, _limit: -1 });

      const programsFiltered =
        programs
          ?.filter((program) => program.published_at !== null)
          ?.map((program) => ({
            _id: program.id || null,
            id: program.id || null,
            title: program.title || null,
            slug: program.slug || null,
            studyFormat: program.studyFormat || null,
            category: {
              type: program.category?.type || null,
              slug: program.category?.slug || null,
            },
            ...(program.study_field
              ? {
                  study_field: {
                    name: program.study_field?.name || null,
                    slug: program.study_field?.slug || null,
                    description: program.study_field?.description || null,
                  },
                }
              : {}),
          })) || [];

      // const journalArticles = await strapi
      //   .query("journal-article")
      //   .find({ published_at_ne: null, _limit: -1 });

      // const journalArticlesFiltered =
      //   journalArticles
      //     ?.filter((journalArticle) => journalArticle.published_at !== null)
      //     ?.map((journalArticle) => ({
      //       title: journalArticle.title || null,
      //       slug: journalArticle.slug || null,
      //       createdAt: journalArticle.created_at || null,
      //       shortDescription: journalArticle.shortDescription || null,
      //       metaDescription: journalArticle.metaDescription || null,
      //       picture: {
      //         url: journalArticle.picture?.url || null,
      //         width: journalArticle.picture?.width || null,
      //         height: journalArticle.picture?.height || null,
      //         alt: journalArticle.picture?.alternativeText || null,
      //       },
      //       journalCategory: {
      //         title: journalArticle.journal_category?.title || null,
      //         slug: journalArticle.journal_category?.slug || null,
      //       },
      //     })) || [];

      // const teachers = await strapi
      //   .query("teacher")
      //   .find({ published_at_ne: null, _limit: -1 });

      // const teachersFiltered =
      //   teachers
      //     ?.filter((teacher) => teacher.published_at !== null)
      //     .map((teacher) => ({
      //       name: teacher.name || null,
      //       description: teacher.description || null,
      //       slug: teacher.slug || null,
      //       portrait: {
      //         width: teacher.portrait?.width || null,
      //         height: teacher.portrait?.height || null,
      //         url: teacher.portrait?.url || null,
      //       },
      //       descriptionItems:
      //         teacher.descriptionItems?.map((item) => ({
      //           item: item?.item || null,
      //         })) || null,
      //       programs:
      //         teacher.programs?.map((program) => program?.title) || null,
      //     })) || [];

      return {
        programs: createBlended(programsFiltered),
        // teachers: teachersFiltered,
        // journalArticles: journalArticlesFiltered,
      };
    } catch (err) {
      console.log(err);
      return { programs: null, teachers: null, journalArticles: null };
    }
  },
  feedYML: async (ctx) => {
    // TODO: the query is not finished & finish this query
    try {
      //POSTGRES

      const categories = await strapi
        .query("category")
        .find({ published_at_ne: null });

      // const categories = await strapi
      //   .query("category")
      //   .model.find(
      //     { published_at: { $ne: null } },
      //     {
      //       slug: 1,
      //       labelCases: 1,
      //     }
      //   )
      //   .populate([{ path: "labelCases", select: "singular" }]);

      //POSTGRES
      const programs = await strapi
        .query("product")
        .model.find({ published_at_ne: null });

      // const programs = await strapi
      //   .query("product")
      //   .model.find(
      //     { published_at: { $ne: null } },
      //     {
      //       id: 1,
      //       title: 1,
      //       slug: 1,
      //       price: 1,
      //       description: 1,
      //       discount: 1,
      //       studyFormat: 1,
      //       category: 1,
      //       study_field: 1,
      //       duration: 1,
      //       baseSubjects: 1,
      //       specializedSubjects: 1,
      //     }
      //   )
      //   .populate([
      //     { path: "category", select: "type" },
      //     { path: "study_field", select: "id name slug description" },
      //     { path: "duration", select: "minStudyMonths" },
      //     { path: "baseSubjects", select: "string" },
      //     { path: "specializedSubjects", select: "string" },
      //   ]);

      const programsFiltered =
        programs
          ?.filter((program) => program)
          ?.map((program) => ({
            _id: program._id || null,
            id: program.id || null,
            title: program.title || null,
            slug: program.slug || null,
            studyFormat: program.studyFormat || null,
            category: {
              type: program.category?.type || null,
              slug: program.category?.slug || null,
            },
            study_field: {
              id: program.study_field?.id || null,
              name: program.study_field?.name || null,
              slug: program.study_field?.slug || null,
              description: program.study_field?.description || null,
            },
          })) || [];

      return { programs: createBlended(programsFiltered) };
    } catch (err) {
      console.log(err);
      return { programs: null };
    }
  },
};
