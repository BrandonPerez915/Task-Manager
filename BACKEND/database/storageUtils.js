import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

import { User } from '../models/user.js'
import { Task } from '../models/task.js'

// Resolver rutas absolutas en un contexto ESM.
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function nextId(items) {
  if (items.length === 0) return 1

  const maxId = Math.max(...items.map(item => item.id))
  return maxId + 1
}

function searchById(items, id) {
  return items.find(item => item.id === id)
}

function searchByProp(items, prop, value) {
  return items.find(item => item[prop] === value)
}

function save(items) {
  if(items.length === 0) return

  const data = {}
  let jsonPath, type

  if(items[0] instanceof User) {
    jsonPath = path.join(__dirname, './users.json')
    type = 'users'
  } else if(items[0] instanceof Task) {
    jsonPath = path.join(__dirname, './tasks.json')
    type = 'tasks'
  } else {
    jsonPath = path.join(__dirname, './tags.json')
    type = 'tags'
  }

  data[type] = items.map(item => item.toObj())

  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2))
}

export { save,  nextId, searchById, searchByProp }
