const { v4: uuidv4 } = require('uuid')

const createBlended = programs => {
  return [
    ...programs,
    ...programs
      .filter(
        program =>
          program._doc?.category?.type === 'mini' ||
          program._doc?.category?.type === 'mba'
      )
      .map(program => {
        const id = uuidv4()
        return { ...program._doc, studyFormat: 'blended', id, _id: id }
      })
  ]
}

module.exports = { createBlended }
