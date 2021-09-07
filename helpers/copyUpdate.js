const fetch = require('node-fetch')
const { rootUrl } = require('../config/config')
const { login } = require('./login')

const copyUpdate = async ({
  method = 'PUT',
  path = '',
  locale = '',
  body = {},
  localizations = []
}) => {
  // console.log(JSON.stringify(body))

  body.labelCases?._id && (body.labelCases._id = undefined)
  body.labelCases?.id && (body.labelCases.id = undefined)
  body.labelCases?.__v && (body.labelCases.__v = undefined)

  const items = localizations.filter(item => item.locale === locale)
  const id = items[0]._id

  const token = await login()
  const res = await fetch(`${rootUrl}${path}/${id}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  })

  if (!res.ok) {
    console.log(res)
    throw new Error('Something went wrong... ' + res)
  }

  console.log('success')
  return true
}

module.exports = { copyUpdate }
