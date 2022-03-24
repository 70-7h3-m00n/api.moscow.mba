const { v4: uuidv4 } = require('uuid')

const createBlended = programs => {
  return [
    ...programs,
    ...programs
      .filter(
        program =>
          program.category?.type === 'mini' || program.category?.type === 'mba'
      )
      .map(program => {
        const id = uuidv4()
        return { ...program, studyFormat: 'blended', id, _id: id }
      })
  ]
}

module.exports = { createBlended }
