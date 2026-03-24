import { Tag } from '../models/tag.js'

import { tags, tasks, save, nextId } from '../database/storage.js'

function postTag(req, res) {
  const { name, color } = req.body

  let newTag
  try {
    newTag = new Tag(nextId(tags), name, color, req.userId)
  } catch (error) {
    return res.status(400).send(error.message)
  }

  tags.push(newTag)
  save(tags)

  return res.status(201).send('Etiqueta creada exitosamente')
}

function getTags(req, res) {
  const userId = req.userId

  const filteredTags = tags.filter(tag => tag.userId === userId)

  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20

  const total = filteredTags.length
  const start = (page - 1) * limit
  const end = start + limit

  const slicedTags = filteredTags.slice(start, end).map(task => task.toObj())


  const nextPage = end < total ? page + 1 : null
  const prevPage = page > 1 ? page - 1 : null
  const totalPages = Math.ceil(total / limit)

  res.status(200).json({
    page,
    limit,
    total,
    start,
    end,
    nextPage,
    prevPage,
    totalPages,
    tags: slicedTags
  })
}

function getTag(req, res) {
  res.status(200).json(req.tag.toObj())
}

function patchTag(req, res) {
  const tag = req.tag
  const properties = req.properties
  const backup = { ...tag }

  try {
    properties.forEach(prop => tag[prop] = req.body[prop])
  } catch (error) {
    Object.assign(tag, backup)
    return res.status(400).message(error.message)
  }

  save(tags)
  return res.status(200).json({
    message: 'Etiqueta modificada con exito',
    tag: tag.toObj()
  })
}

function deleteTag(req, res) {
  const tag = req.tag

  for(const task of tasks) {
    if(tag.userId === task.userId && task.tags.includes(tag.id))
      return res.status(400).send('No es posible eliminar esta etiqueta porque pertenece a una tarea')
  }

  const index = tags.indexOf(tag)
  tags.splice(index, 1)

  save(tags)

  return res.status(200).json({
    message: `La etiqueta con id ${tag.id} perteneciente al usuario con id ${tag.userId} eliminada`,
    tag: tag.toObj()
  })

}

export {
  postTag, getTags, getTag, patchTag, deleteTag
}
