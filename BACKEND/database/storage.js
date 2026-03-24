import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

import rawTasks from './tasks.json' with { type: 'json' }
import rawUsers from './users.json' with { type: 'json' }
import rawTags from './tags.json' with { type: 'json' }

import { User } from '../models/user.js'
import { Task } from '../models/task.js'
import { Tag } from '../models/tag.js'

// Resolver rutas absolutas en un contexto ESM.
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const users = rawUsers.users.map(object => {
  return new User(object.id, object.name, object.email, object.password, object.password)
})

const tasks = rawTasks.tasks.map(object => {
  return new Task(
    object.id,
    object.title,
    object.description,
    object.dueDate,
    object.userId,
    object.status,
    object.tags
  )
})

const tags = rawTags.tags.map(object => {
  return new Tag(object.id, object.name, object.color, object.userId)
})

function nextId(items) {
  if (items.length === 0) return 1

  const maxId = Math.max(...items.map(item => item.id))
  return maxId + 1
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


export {
  users, tasks, tags, nextId, save
}
