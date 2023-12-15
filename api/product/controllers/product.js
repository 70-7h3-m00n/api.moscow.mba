"use strict";
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { createBlended } = require("../../../helpers/index");

module.exports = {
  getStaticProps: async () => {
    const programs = await strapi
      .query("product")
      .find({ published_at_ne: null, _limit: -1 });

    const programsFiltered =
      programs
        ?.filter((program) => program)
        ?.map((program) => ({
          _id: program.id || null,
          id: program.id || null,
          title: program.title || null,
          slug: program.slug || null,
          isActive: program.isActive || null,
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

    const teachers = await strapi
      .query("teacher")
      .find({ published_at_ne: null });

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
          programs: teacher.programs?.map((program) => program?.title) || null,
        })) || [];

    const programsWithBlended = createBlended(programsFiltered);

    return {
      programs: programsWithBlended,
      teachers: teachersFiltered.filter(
        (v, i, a) => a.findIndex((t) => t.slug === v.slug) === i
      ),
    };
  },
  getStaticPropsProfession: async () => {
    const programs = await strapi
      .query("product")
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
          duration: {
            minStudyMonths: program.duration?.minStudyMonths || null,
          },
        })) || [];

    const teachers = await strapi
      .query("teacher")
      .find({ published_at_ne: null });

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
          programs: teacher.programs?.map((program) => program?.title) || null,
        })) || [];

    const programsWithBlended = createBlended(programsFiltered);

    return {
      programs: programsWithBlended,
      teachers: teachersFiltered.filter(
        (v, i, a) => a.findIndex((t) => t.slug === v.slug) === i
      ),
    };
  },
  getStaticPropsCourse: async () => {
    const programs = await strapi
      .query("product")
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
          duration: {
            minStudyMonths: program.duration?.minStudyMonths || null,
          },
        })) || [];

    const teachers = await strapi
      .query("teacher")
      .find({ published_at_ne: null });

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
          programs: teacher.programs?.map((program) => program?.title) || null,
        })) || [];

    const programsWithBlended = createBlended(programsFiltered);

    return {
      programs: programsWithBlended,
      teachers: teachersFiltered.filter(
        (v, i, a) => a.findIndex((t) => t.slug === v.slug) === i
      ),
    };
  },
  getStaticPropsPromo: async () => {
    const programs = await strapi
      .query("product")
      .find({ published_at_ne: null, _limit: -1 });

    const programsFiltered =
      programs
        ?.filter((program) => program)
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
          duration: {
            minStudyMonths: program.duration?.minStudyMonths || null,
          },
          whatWillYouLearn:
            program.whatWillYouLearn?.map((item) => ({
              string: item?.string || null,
            })) || null,
        })) || [];

    const teachers = await strapi
      .query("teacher")
      .find({ published_at_ne: null });

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
          programs: teacher.programs?.map((program) => program?.title) || null,
        })) || [];

    const programsTypeMini = programsFiltered.filter(
      (item) => item.category?.type === "mini"
    );

    return {
      programs: programsTypeMini,
      teachers: teachersFiltered.filter(
        (v, i, a) => a.findIndex((t) => t.slug === v.slug) === i
      ),
    };
  },
  getProgram: async (ctx) => {
    const typeSlug = ctx.request.url.split("/")[3].split(".");
    const type = typeSlug[0];
    const slug = typeSlug[1];

    const programs = await strapi.query("product").find({
      slug,
      published_at_ne: null,
    });

    const program = programs.filter((item) => item.category?.type === type)[0];

    return [program].map((item) => {
      item.teachers.map((teacher) => {
        teacher.programs = undefined;
        return teacher;
      });
      return item;
    })[0];
  },
  getStaticPaths: async (ctx) => {
    const type = ctx.request.url.split("/")[3];

    //POSTGRES
    const paths = await strapi.query("product").find({
      published_at_ne: null,
      _limit: -1,
    });

    const pathsFiltered = paths.filter((path) => path.category?.type === type);

    const output = pathsFiltered.map(({ slug }) => ({
      params: { slug },
    }));

    return output;
  },
};
