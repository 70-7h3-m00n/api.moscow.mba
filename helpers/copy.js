const fetch = require('node-fetch')
const { rootUrl } = require('../config/config')
const { login } = require('./login')

const copy = async ({
  method = 'POST',
  path = '',
  locale = '',
  body = {},
  id = ''
}) => {
  // console.log(JSON.stringify(body))
  body._id && (body._id = undefined)
  body.id && (body.id = undefined)
  body.published_at && (body.published_at = undefined)
  body.createdAt && (body.createdAt = undefined)
  body.updatedAt && (body.updatedAt = undefined)
  body.__v && (body.__v = undefined)
  body.localizations && (body.localizations = undefined)

  body.labelCases._id && (body.labelCases._id = undefined)
  body.labelCases.id && (body.labelCases.id = undefined)
  body.labelCases.__v && (body.labelCases.__v = undefined)

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
