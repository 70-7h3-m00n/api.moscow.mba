const { prod } = require('../../../config/config')
const axios = require('axios')

const handleRevalidate = async ({ path }) => {
  if (prod) {
    try {
      await axios.get(
        `${process.env.FRONTEND_ROUTE}/api/revalidate/?secret=${
          process.env.REVALIDATE_TOKEN
        }&path=${encodeURIComponent(path)}`
      )
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = { handleRevalidate }
