const dev = process.env.NODE_ENV === 'development'
const prod = process.env.NODE_ENV === 'production'
const rootUrl = dev
  ? 'http://localhost:1337'
  : prod
  ? 'https://api-moscow-mba.herokuapp.com'
  : null
const categoryUrl = '/categories'
const authUrl = '/auth'
const localUrl = '/local'

module.exports = { dev, prod, rootUrl, categoryUrl, authUrl, localUrl }
