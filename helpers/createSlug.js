const slugify = require('slugify')

const createSlug = ({ data = {}, field = '', slug = '' }) => {
  try {
    data[field] && ((data.slug = slugify(data[field], { lower: true })), slug)
    return true
  } catch (err) {
    console.log(err)
  }
}

module.exports = { createSlug }
