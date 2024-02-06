module.exports = ({ env }) => ({
  // ...
  upload: {
    provider: "cloudinary",
    providerOptions: {
      cloud_name: env("CLOUDINARY_NAME"),
      api_key: env("CLOUDINARY_API_KEY"),
      api_secret: env("CLOUDINARY_API_SECRET"),
    },
    actionOptions: {
      upload: {},
      delete: {},
    },
  },
  graphql: {
    amountLimit: -1,
    // endpoint: '/graphql',
    // shadowCRUD: true,
    // playgroundAlways: false,
    // depthLimit: 7,
    // apolloServer: {
    //   tracing: false
    // }
  },
  // ...
});
