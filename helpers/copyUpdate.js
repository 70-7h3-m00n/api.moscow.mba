const fetch = require('node-fetch')
const { rootUrl } = require('../config/config')
const { login } = require('./login')
const { unsetUniqueProps } = require('./unsetUniqueProps')

const copyUpdate = async ({
  method = 'PUT',
  path = '',
  locale = '',
  body = {},
  localizations = []
}) => {
  // console.log(JSON.stringify(body))

  unsetUniqueProps({
    arr: [
      body.labelCases,
      body.whatWillYouLearn,
      body.specializedSubjects,
      body.duration,
      body.baseSubjects,
      body.programModulesCounters,
      body.picture
    ]
  })

  body.diplomas &&
    body.diplomas.forEach(diploma => {
      diploma._id && (diploma._id = undefined)
      diploma.id && (diploma.id = undefined)
      diploma.__v && (diploma.__v = undefined)

      diploma &&
        Array.prototype.forEach.call(diploma, item => {
          item._id && (item._id = undefined)
          item.id && (item.id = undefined)
          item.__v && (item.__v = undefined)
        })
    })

  const items = localizations.filter(item => item.locale === locale)
  const id = items[0] && items[0]._id

  const token = await login()
  const res =
    id &&
    (await fetch(`${rootUrl}${path}/${id}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    }))

  if (res) {
    if (id) {
      console.log('nothing to update')
      return true
    }
    if (!res.ok) {
      console.log(res)
      throw new Error('Something went wrong... ' + res)
    }
  }

  console.log('success')
  return true
}

module.exports = { copyUpdate }
