module.exports = ({ env }) => ({
  // ...
  upload: {
    provider: 'cloudinary',
    providerOptions: {
      cloud_name: env(process.env.CLOUDINARY_NAME),
      api_key: env(process.env.CLOUDINARY_API_KEY),
      api_secret: env(process.env.CLOUDINARY_API_SECRET)
    },
    actionOptions: {
      upload: {},
      delete: {}
    }
  }
  // ...
})
