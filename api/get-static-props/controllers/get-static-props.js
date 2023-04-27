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
      // //POSTGRES
      const programs = await strapi.query("product").find({ id_ne: null });

      // const programs = await strapi
      //   .query('product')
      //   .model.find(
      //     { published_at: { $ne: null } },
      //     {
      //       id: 1,
      //       title: 1,
      //       slug: 1,
      //       studyFormat: 1,
      //       category: 1,
      //       study_field: 1
      //     }
      //   )
      //   .populate([
      //     { path: 'category', select: 'type slug' },
      //     { path: 'study_field', select: 'id name slug description' }
      //   ])

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

      return {
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

      //POSTGRES
      const programs = await strapi
        .query("product")
        .find({ published_at_ne: null });

      // const programs = await strapi
      //   .query("product")
      //   .model.find(
      //     { published_at: { $ne: null } },
      //     {
      //       id: 1,
      //       title: 1,
      //       slug: 1,
      //       studyFormat: 1,
      //       category: 1,
      //       study_field: 1,
      //     }
      //   )
      //   .populate([
      //     { path: "category", select: "id type slug" },
      //     { path: "study_field", select: "id name slug description" },
      //   ]);

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
        ?.filter((program) => program)
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

      //POSTGRES
      const journalArticles = await strapi
        .query("journal-article")
        .find({ published_at_ne: null, slug: journalSlug });

      // const journalArticles = await strapi
      //   .query("journal-article")
      //   .model.find(
      //     { published_at: { $ne: null }, slug: journalSlug },
      //     {
      //       title: 1,
      //       slug: 1,
      //       createdAt: 1,
      //       shortDescription: 1,
      //       metaTitle: 1,
      //       metaDescription: 1,
      //       noindex: 1,
      //       nofollow: 1,
      //       picture: 1,
      //       pdfMaterials: 1,
      //       journal_category: 1,
      //       journal_tags: 1,
      //       journal_authors: 1,
      //       programs: 1,
      //       articleBody: 1,
      //     }
      //   )
      //   .populate([
      //     {
      //       path: "picture",
      //       select: "url width height alternativeText",
      //     },
      //     {
      //       path: "pdfMaterials",
      //       select: "url width height alternativeText",
      //     },
      //     { path: "journal_category", select: "title slug" },
      //     { path: "journal_tags", select: "title slug" },
      //     {
      //       path: "programs",
      //       populate: {
      //         path: "category",
      //       },
      //     },
      //     {
      //       path: "journal_authors",
      //       select: "label firstName lastName portrait",
      //     },
      //     // {
      //     //   path: 'articleBody.portrait',
      //     //   select: 'url width height alternativeText'
      //     // }
      //   ]);

      const journalArticle =
        journalArticles?.filter((journalArticle) => journalArticle)?.[0] ||
        null;

      //POSTGRES
      const journalArticleCategories = await strapi
        .query("journal-category")
        .find({ published_at_ne: null });

      // const journalArticleCategories = await strapi
      //   .query("journal-category")
      //   .model.find(
      //     {
      //       published_at: { $ne: null },
      //     },
      //     {
      //       title: 1,
      //       slug: 1,
      //     }
      //   );

      // console.log(
      //   util.inspect(journalArticleCategories, {
      //     showHidden: false,
      //     depth: null,
      //     colors: true
      //   })
      // )

      // console.log(journalArticle.programs)

      // console.log(
      //   util.inspect(journalArticle.articleBody, {
      //     showHidden: false,
      //     depth: null,
      //     colors: true
      //   })
      // )

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

      // console.log(bodyArticleHtmlTables)

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
        testJournalAuthors: journalArticle.journal_authors,
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
        testRecommendedPrograms: journalArticle.programs,
        recommendedPrograms:
          journalArticle.programs?.map((program) => ({
            title: program?.title || null,
            slug: program?.slug || null,
            categorySlug: program?.category?.slug || null,
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
                    test: htmlTableBodyTable,
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
                      test: component,
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

            // return {
            //   __typename: component?.kind || null,
            //   ...(component?.kind === "ComponentJournalParagraph"
            //     ? {
            //         paragraphBodyParts:
            //           component?.ref?.paragraphBody?.map((item) => ({
            //             text: item?.ref?.text || null,
            //             ...(item?.ref?.isLarger
            //               ? {
            //                   isLarger: item?.ref?.isLarger,
            //                 }
            //               : {}),
            //             ...(item?.ref?.isHighlighted
            //               ? {
            //                   isHighlighted: item?.ref?.isHighlighted,
            //                 }
            //               : {}),
            //           })) || [],
            //       }
            //     : {}),
            //   ...(component?.kind === "ComponentJournalTitle"
            //     ? {
            //         title: {
            //           titleBodyParts:
            //             component?.ref?.titleBody?.map((item) => ({
            //               text: item?.ref?.text || null,
            //               ...(item?.ref?.isHighlighted
            //                 ? {
            //                     isHighlighted: item?.ref?.isHighlighted,
            //                   }
            //                 : {}),
            //             })) || [],
            //           hType: component?.ref?.hType || null,
            //         },
            //       }
            //     : {}),
            //   ...(component?.kind === "ComponentGeneralPicture"
            //     ? {
            //         picture: {
            //           url: component?.ref?.picture?.url || null,
            //           width: component?.ref?.picture?.width || null,
            //           height: component?.ref?.picture?.height || null,
            //           ...(component?.portrait?.alternativeText
            //             ? {
            //                 alt: component?.portrait?.alternativeText,
            //               }
            //             : {}),
            //           title: component?.ref?.title || null,
            //         },
            //       }
            //     : {}),
            //   ...(component?.kind === "ComponentJournalEmphasis"
            //     ? {
            //         emphasisBody: component?.ref?.emphasisBody || null,
            //       }
            //     : {}),
            //   ...(component?.kind === "ComponentJournalFormPdfMaterials"
            //     ? {
            //         formPdfMaterials: {
            //           title: component?.ref?.title || null,
            //         },
            //       }
            //     : {}),
            //   ...(component?.kind === "ComponentJournalJournalTable"
            //     ? {
            //         htmlTableBody: {
            //           // name: component?.ref?.htmlTable?.name || null,
            //           // url: component?.ref?.htmlTable?.url || null,
            //           // ...(component?.ref?.htmlTableBody?.alternativeText
            //           //   ? {
            //           //       alt: component?.ref?.htmlTableBody?.alternativeText
            //           //     }
            //           //   : {}),
            //           table: htmlTableBodyTable?.[idx]?.table || null,
            //         },
            //       }
            //     : {}),
            //   ...(component?.kind === "ComponentJournalQuote"
            //     ? {
            //         quote: {
            //           body: component?.ref?.body || null,
            //           label: component?.ref?.label || null, // * not in the strapi yet
            //           authorPosition: component?.ref?.athorPosition || null,
            //           authorName: component?.ref?.authorName || null,
            //           portrait: {
            //             url: component?.ref?.portrait?.url || null,
            //             width: component?.ref?.portrait?.width || null,
            //             height: component?.ref?.portrait?.height || null,
            //             ...(component?.portrait?.alternativeText
            //               ? {
            //                   alt: component?.ref?.portrait?.alternativeText,
            //                 }
            //               : {}),
            //           },
            //         },
            //       }
            //     : {}),
            //   ...(component?.kind ===
            //   "ComponentJournalJournalRecommendedArticles"
            //     ? {
            //         journalRecommendedArticles: {
            //           title: component?.ref?.title || null,
            //           articles:
            //             component?.ref?.journal_articles?.map(
            //               (journalArticle) => ({
            //                 title: journalArticle?.title || null,
            //                 slug: journalArticle?.slug || null,
            //               })
            //             ) || [],
            //         },
            //       }
            //     : {}),
            //   ...(component?.kind === "ComponentJournalReadAlsoArticles"
            //     ? {
            //         journalReadAlsoArticles: {
            //           title: component?.ref?.title || null,
            //           articles:
            //             component?.ref?.journal_articles
            //               ?.filter(
            //                 (item) => item
            //                 // &&
            //                 // journalArticle?.articleBody
            //                 //   .filter(
            //                 //     component =>
            //                 //       component?.kind ===
            //                 //       'ComponentJournalJournalRecommendedArticles'
            //                 //   )
            //                 //   .map(piece => piece?.ref?.title)
            //                 //   .some(title => title === item?.title)
            //               )
            //               .map((article) => ({
            //                 title: article?.title || null,
            //                 slug: article?.slug || null,
            //                 createdAt: article.createdAt || null,
            //                 picture: {
            //                   url: article?.picture?.url || null,
            //                   width: article?.picture?.width || null,
            //                   height: article?.picture?.height || null,
            //                   alt: article?.picture?.alternativeText || null,
            //                 },
            //                 journalCategory: article?.journal_category
            //                   ? journalArticleCategories
            //                       .filter(
            //                         (journalArticleCategory) =>
            //                           journalArticleCategory?._id
            //                             ?.toString()
            //                             ?.trim() ===
            //                           article?.journal_category
            //                             .toString()
            //                             ?.trim()
            //                       )
            //                       .map((item) => ({
            //                         title: item?.title || null,
            //                         slug: item?.slug || null,
            //                       }))?.[0]
            //                   : null,
            //               })) || [],
            //         },
            //       }
            //     : {}),
            //   ...(component?.kind ===
            //   "ComponentJournalJournalRecommendedProgram"
            //     ? {
            //         recommendedProgram: {
            //           title: component?.ref?.title || null,
            //           btnValue: component?.ref?.btnValue || null,
            //           program: {
            //             title: component?.ref?.program?.title || null,
            //             slug: component?.ref?.program?.slug || null,
            //             categorySlug:
            //               component?.ref?.program?.category?.slug ||
            //               programCategories.find((programCategory) => {
            //                 return (
            //                   programCategory?.id
            //                     ?.toString()
            //                     ?.trim()
            //                     ?.toLowerCase() ===
            //                   component?.ref?.program?.category
            //                     ?.toString()
            //                     ?.trim()
            //                     ?.toLowerCase()
            //                 );
            //               })?.slug ||
            //               null,
            //             studyFormatSlug:
            //               component?.ref?.program?.studyFormat || null,
            //             icon: component?.ref?.program?.icon || null,
            //           },
            //         },
            //       }
            //     : {}),
            //   ...(component?.kind === "ComponentJournalList"
            //     ? {
            //         list: {
            //           items: component?.ref?.listItem?.map((item) => ({
            //             body: item?.ref?.body || null,
            //           })),
            //           tag: component?.ref?.tag || null,
            //         },
            //       }
            //     : {}),
            //   ...(component?.kind === "ComponentJournalConclusion"
            //     ? {
            //         conclusion:
            //           component?.ref?.item?.map((item) => ({
            //             title: item?.ref?.title || null,
            //             body: item?.ref?.body || null,
            //           })) || [],
            //       }
            //     : {}),
            //   ...(component?.kind ===
            //   "ComponentJournalJournalArticleRecommendedProgramsSection"
            //     ? {
            //         recommendedProgramsSection: {
            //           btnVal: component?.ref?.btnVal || null,
            //           title:
            //             component?.ref?.sectionTitle.map((item) => ({
            //               titlePart: item?.ref?.text || null,
            //               isHighlighted: item?.ref?.isHighlighted || null,
            //             })) || [],
            //           shortTextAtTheBottom:
            //             component?.ref?.shortTextAtTheBottom?.map((item) => ({
            //               textPart: item?.ref?.text || null,
            //               isHighlighted: item?.ref?.isHighlighted || null,
            //             })) || [],
            //           programs: component?.ref?.programs?.map((program) => {
            //             // console.log('program.category: ', program.category)
            //             // console.log('programCategories: ', programCategories)
            //             return {
            //               title: program?.title || null,
            //               slug: program?.slug || null,
            //               categorySlug:
            //                 program?.category?.slug ||
            //                 programCategories.find(
            //                   (programCategory) =>
            //                     programCategory?.id
            //                       ?.toString()
            //                       ?.trim()
            //                       ?.toLowerCase() ===
            //                     program?.category
            //                       ?.toString()
            //                       ?.trim()
            //                       ?.toLowerCase()
            //                 )?.slug ||
            //                 null,
            //               studyFormatSlug: program?.studyFormat || null,
            //               icon: program?.icon || null,
            //             };
            //           }),
            //         },
            //       }
            //     : {}),
            // };
          }) || null,
      };

      return {
        programs: createBlended(programsFiltered),
        journalArticle: journalArticleFiltered,
        // journalArticle
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
      //POSTGRES
      const programs = await strapi
        .query("product")
        .find({ published_at_ne: null });

      // const programs = await strapi
      //   .query("product")
      //   .model.find(
      //     { published_at: { $ne: null } },
      //     {
      //       id: 1,
      //       title: 1,
      //       slug: 1,
      //       studyFormat: 1,
      //       category: 1,
      //       study_field: 1,
      //     }
      //   )
      //   .populate([
      //     { path: "category", select: "type slug" },
      //     { path: "study_field", select: "id name slug description" },
      //   ]);

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

      //POSTGRES
      const journalCategories = await strapi
        .query("journal-category")
        .find({ published_at_ne: null });

      // const journalCategories = await strapi
      //   .query("journal-category")
      //   .model.find(
      //     { published_at: { $ne: null } },
      //     {
      //       id: 1,
      //       title: 1,
      //       slug: 1,
      //     }
      //   );

      const journalCategoriesFiltered =
        journalCategories
          ?.filter((journalCategory) => journalCategory)
          ?.map((journalCategory) => ({
            title: journalCategory.title || null,
            slug: journalCategory.slug || null,
          })) || [];

      //POSTGRES
      const journalArticles = await strapi
        .query("journal-article")
        .find({ published_at_ne: null });

      // const journalArticles = await strapi
      //   .query("journal-article")
      //   .model.find(
      //     { published_at: { $ne: null } },
      //     {
      //       title: 1,
      //       slug: 1,
      //       createdAt: 1,
      //       shortDescription: 1,
      //       metaDescription: 1,
      //       picture: 1,
      //       journal_category: 1,
      //     }
      //   )
      //   .populate([
      //     {
      //       path: "picture",
      //       select: "url width height alternativeText",
      //     },
      //     { path: "journal_category", select: "title slug" },
      //   ]);

      const journalArticlesFiltered =
        journalArticles
          ?.filter((journalArticle) => journalArticle)
          ?.map((journalArticle) => ({
            title: journalArticle.title || null,
            slug: journalArticle.slug || null,
            createdAt: journalArticle.created_at || null,
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
        .find({ published_at_ne: null });

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

      //POSTGRES
      const programs = await strapi
        .query("product")
        .find({ published_at_ne: null });

      // const programs = await strapi
      //   .query("product")
      //   .model.find(
      //     { published_at: { $ne: null } },
      //     {
      //       id: 1,
      //       title: 1,
      //       slug: 1,
      //       studyFormat: 1,
      //       category: 1,
      //       study_field: 1,
      //     }
      //   )
      //   .populate([
      //     { path: "category", select: "type slug" },
      //     { path: "study_field", select: "id name slug description" },
      //   ]);

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

      //POSTGRES
      const programsProgram = await strapi
        .query("product")
        .find({ published_at_ne: null, slug: programSlug });

      // const programsProgram = await strapi
      //   .query("product")
      //   .model.find(
      //     {
      //       published_at: { $ne: null },
      //       slug: programSlug,
      //     },
      //     {
      //       id: 1,
      //       title: 1,
      //       slug: 1,
      //       metaTitle: 1,
      //       metaDescription: 1,
      //       noindex: 1,
      //       nofollow: 1,
      //       studyFormat: 1,
      //       category: 1,
      //       study_field: 1,
      //       picture: 1,
      //       whatWillYouLearn: 1,
      //       specializedSubjects: 1,
      //       goal: 1,
      //       description: 1,
      //       duration: 1,
      //       price: 1,
      //       discount: 1,
      //       baseSubjects: 1,
      //       subjectsStickerType: 1,
      //       programModulesCounters: 1,
      //       diplomas: 1,
      //       whoIsFor: 1,
      //       specializedSubjectsAddons: 1,
      //       teachers: 1,
      //       questions: 1,
      //       reviews: 1,
      //     }
      //   )
      //   .populate([
      //     { path: "category", select: "type slug" },
      //     { path: "study_field", select: "id name slug description" },
      //     { path: "picture", select: "url width height" },
      //     { path: "whatWillYouLearn", select: "string" },
      //     { path: "specializedSubjects", select: "string title" },
      //     { path: "duration", select: "studyHours minStudyMonths" },
      //     { path: "baseSubjects", select: "string title" },
      //     {
      //       path: "programModulesCounters",
      //       select: "leftCounter rightCounter",
      //     },
      //     { path: "diplomas", select: "diploma name" },
      //     { path: "whoIsFor", select: "name description" },
      //     {
      //       path: "specializedSubjectsAddons",
      //       select: "Practice OfflineModule diplomaProtection",
      //     },
      //     {
      //       path: "teachers",
      //       select: "name description slug portrait descriptionItems",
      //     },
      //     {
      //       path: "questions",
      //       select: "question answer",
      //     },
      //     {
      //       path: "reviews",
      //       select: "picture name desc story",
      //     },
      //   ]);

      const programFiltered =
        programsProgram
          .filter((program) => program?.category?.type === typeSlug)
          ?.map((program) => ({
            test: programsProgram,
            _id: program.id || null,
            id: program.id || null,
            title: program.title || null,
            slug: program.slug || null,
            metaTitle: program.metaTitle || null,
            metaDescription: program.metaDescription || null,
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
            },
            whatWillYouLearn:
              program.whatWillYouLearn?.map((item) => ({
                string: item?.string || null,
              })) || null,
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
            // program.specializedSubjectsAddons?.map((addon) => ({
            //   Practice: addon?.Practice || null,
            //   OfflineModule: addon?.OfflineModule || null,
            //   diplomaProtection: addon?.diplomaProtection || null,
            // }))?.[0] || null,
            goal: program.goal || null,
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
              program.teachers?.map((teacher) => ({
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

      return {
        test: programsProgram,
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
      //POSTGRES
      const programs = await strapi
        .query("product")
        .find({ published_at_ne: null });

      // const programs = await strapi
      //   .query("product")
      //   .model.find(
      //     { published_at: { $ne: null } },
      //     {
      //       id: 1,
      //       title: 1,
      //       slug: 1,
      //       studyFormat: 1,
      //       price: 1,
      //       duration: 1,
      //       category: 1,
      //       study_field: 1,
      //       updatedAt: 1,
      //     }
      //   )
      //   .populate([
      //     { path: "duration", select: "minStudyMonths" },
      //     { path: "category", select: "type slug" },
      //     { path: "study_field", select: "id name slug description" },
      //   ]);

      const programsFiltered =
        programs
          ?.filter((program) => program)
          ?.map((program) => ({
            _id: program.id || null,
            id: program.id || null,
            title: program.title || null,
            slug: program.slug || null,
            studyFormat: program.studyFormat || null,
            price: program.price || null,
            updatedAt: program.updated_at || null,
            duration: {
              minStudyMonths: program.duration?.minStudyMonths || null,
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

      return {
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

      //POSTGRES
      const programs = await strapi
        .query("product")
        .find({ published_at_ne: null });

      // const programs = await strapi
      //   .query("product")
      //   .model.find(
      //     { published_at: { $ne: null } },
      //     {
      //       id: 1,
      //       title: 1,
      //       slug: 1,
      //       studyFormat: 1,
      //       category: 1,
      //       study_field: 1,
      //     }
      //   )
      //   .populate([
      //     { path: "category", select: "type slug" },
      //     { path: "study_field", select: "id name slug description" },
      //   ]);

      const teachers = await strapi
        .query("teacher")
        .find({ published_at_ne: null, slug: teacherSlug });

      // const teachers = await strapi.query("teacher").model.find(
      //   { published_at: { $ne: null }, slug: teacherSlug },
      //   {
      //     name: 1,
      //     description: 1,
      //     slug: 1,
      //     portrait: 1,
      //     descriptionItems: 1,
      //   }
      // );

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

      const teachersFiltered = teachers
        ?.filter((teacher) => teacher)
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
      // P O S T G R E S
      const programs = await strapi.query("product").find({ id_ne: null });
      // const programs = await strapi
      //   .query("product")
      //   .model.find(
      //     { published_at: { $ne: null } },
      //     {
      //       id: 1,
      //       title: 1,
      //       slug: 1,
      //       studyFormat: 1,
      //       category: 1,
      //       study_field: 1,
      //     }
      //   )
      //   .populate([
      //     { path: "category", select: "type slug" },
      //     { path: "study_field", select: "id name slug description" },
      //   ]);

      // const teachers = await strapi
      //   .query("teacher")
      //   .model.find(
      //     { published_at: { $ne: null } },
      //     {
      //       name: 1,
      //       description: 1,
      //       slug: 1,
      //       portrait: 1,
      //       descriptionItems: 1,
      //       programs: 1,
      //     }
      //   )
      //   .populate([{ path: "programs", select: "title" }]);

      // P O S T G R E S
      const teachers = await strapi
        .query("teacher")
        .find({ published_at_ne: null });

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
          ?.filter((teacher) => teacher)
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
  defaultMskAcademy: async (ctx) => {
    const typeSlug = ctx?.request?.url?.split("/")?.[3] || "mini";
    // const programSlug = ctx?.request?.url?.split('/')?.[4] || ''

    try {
      // P O S T G R E S
      const programs = await strapi
        .query("product")
        .find({ published_at_ne: null });

      // const programs = await strapi
      //   .query("product")
      //   .model.find(
      //     { published_at: { $ne: null } },
      //     {
      //       id: 1,
      //       title: 1,
      //       slug: 1,
      //       category: 1,
      //       duration: 1,
      //       whatWillYouLearn: 1,
      //     }
      //   )
      //   .populate([
      //     { path: "category", select: "type slug" },
      //     { path: "duration", select: "minStudyMonths" },
      //     { path: "whatWillYouLearn", select: "string" },
      //   ]);

      const programsFiltered =
        programs
          ?.filter((program) => program?.category?.type === typeSlug)
          ?.map((program, id) => ({
            id: program.id || null,
            title: program.title || null,
            slug: program.slug || null,
            duration: {
              minStudyMonths:
                Number(programs[id].duration?.minStudyMonths) || null,
            },
            whatWillYouLearn: program.whatWillYouLearn?.map((item) => ({
              string: item?.string || null,
            })),
          })) || [];

      return {
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
      // P O S T G R E S
      const programsProgram = await strapi.query("product").find({
        published_at_ne: null,
        slug: programSlug,
      });

      // const programsProgram = await strapi
      //   .query("product")
      //   .model.find(
      //     {
      //       published_at: { $ne: null },
      //       slug: programSlug,
      //     },
      //     {
      //       id: 1,
      //       title: 1,
      //       slug: 1,
      //       goal: 1,
      //       category: 1,
      //       duration: 1,
      //       whatWillYouLearn: 1,
      //       picture: 1,
      //       price: 1,
      //       discount: 1,
      //       whoIsFor: 1,
      //       baseSubjects: 1,
      //       specializedSubjects: 1,
      //       teachers: 1,
      //     }
      //   )
      //   .populate([
      //     { path: "category", select: "type slug" },
      //     {
      //       path: "picture",
      //       select: "url width height alternativeText",
      //     },
      //     { path: "whatWillYouLearn", select: "string" },
      //     { path: "specializedSubjects", select: "string title" },
      //     { path: "duration", select: "minStudyMonths" },
      //     { path: "baseSubjects", select: "string title" },
      //     { path: "whoIsFor", select: "name description" },
      //     {
      //       path: "teachers",
      //       select: "name description slug portrait descriptionItems",
      //     },
      //   ]);

      const programFiltered =
        programsProgram
          .filter((program) => program?.category?.type === typeSlug)
          ?.map((program, id) => ({
            // test1: program,
            // test2: programsProgram[0],
            id: program.id || null,
            title: program.title || null,
            slug: program.slug || null,
            price: programsProgram[id].price || null,
            discount: program.discount || null,
            goal: program.goal || null,
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

      return {
        programs: programFiltered,
      };
    } catch (err) {
      console.log(err);
      return { programs: null };
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
