const fetch = require('node-fetch')
const { rootUrl } = require('../config/config')
const { login } = require('./login')
const { unsetUniqueProps } = require('./unsetUniqueProps')

const copy = async ({
  method = 'POST',
  path = '',
  locale = '',
  body = {},
  id = ''
}) => {
  // console.log(JSON.stringify(body))
  //
  unsetUniqueProps({
    arr: [
      body,
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

  body.locale = locale
  const token = await login()
  const res = await fetch(`${rootUrl}${path}/${id}/localizations`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  })

  if (!res.ok) {
    console.log(res)
    throw new Error('Something went wrong... ' + JSON.stringify(res))
  }

  console.log('success')
  return true
}

module.exports = { copy }
