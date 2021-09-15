const unsetUniqueProps = ({ arr }) => {
  if (arr) {
    arr.forEach(obj => {
      if (obj) {
        obj._id && (obj._id = undefined)
        obj.id && (obj.id = undefined)
        obj.published_at && (obj.published_at = undefined)
        obj.createdAt && (obj.createdAt = undefined)
        obj.updatedAt && (obj.updatedAt = undefined)
        obj.__v && (obj.__v = undefined)
        obj.localizations && (obj.localizations = undefined)
      }
    })
  }
}

module.exports = { unsetUniqueProps }
