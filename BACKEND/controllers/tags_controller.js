import { Tag } from '../models/tag.js'
import { data } from '../db.js'

function createTag(name, color) {
  data.tags.push(new Tag(name, color))
}

function getTagById(id) {
  let tag = data.tags.find((tag) => tag.id === id)

  if (!tag) throw new Error('404 - Tag not found')
  else return tag
}

function searchTags(attribute, value) {
  if (data.tags.length === 0) return []
  const firstTag = data.tags[0]

  if (!(attribute in firstTag)) {
    throw new Error(`El atributo "${attribute}" no existe en la clase Tag.`)
  }

  return data.tags.filter((tag) => {
    const tagValue = tag[attribute]

    if (typeof tagValue === 'string') {
      return tagValue.toLowerCase().includes(String(value).toLowerCase())
    }

    return tagValue == value
  })
}

function getAllTags() {
  return data.tags
}

function updateTag(id, newInfo) {
  let tag = data.tags.find((tag) => tag.id === id)

  if (!tag) {
    throw new Error('404 - Tag not found')
  }

  const validAttributes = ['name', 'color']
  let updatedCount = 0

  for (let key in newInfo) {
    if (validAttributes.includes(key)) {
      // Propagación de posibles errores en los setters de Tag
      try {
        tag[key] = newInfo[key]
        updatedCount++
      } catch (error) {
        throw new Error(`Error al actualizar el tag: ${error.message}`)
      }
    }
  }

  if (updatedCount === 0) {
    throw new Error('Ningun atributo válido para actualizar tag')
  }

  return true
}

function deleteTag(id) {
  const index = data.tags.findIndex((tag) => tag.id === id)

  if (index === -1) {
    throw new Error('404 - Tag not found')
  }

  data.tags.splice(index, 1)
  return true
}

export { createTag, getTagById, searchTags, getAllTags, updateTag, deleteTag }
