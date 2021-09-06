const { copy } = require('./copy')
const { categoryUrl } = require('../config/config')

const handleCopy = async ({ method, data }) => {
  const copyRes = await copy({
    method,
    path: categoryUrl,
    locale: 'kk',
    body: data
  })
}

module.exports = { handleCopy }
