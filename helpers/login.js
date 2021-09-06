const { rootUrl, authUrl, localUrl } = require('../config/config')
const fetch = require('node-fetch')

const login = async () => {
  const identifier = process.env.STRAPI_AUTH_USER_LOGIN
  const password = process.env.STRAPI_AUTH_USER_PASSWORD

  const res = await fetch(`${rootUrl}${authUrl}${localUrl}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password })
  })

  const data = await res.json()

  if (res.ok) return data.jwt
  if (!res.ok) {
    console.log(res)
    throw new Error('Something went wrong...')
  }
}

module.exports = { login }
