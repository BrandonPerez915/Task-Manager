import rawTasks from './tasks.json' with { type: 'json' }
import rawUsers from './users.json' with { type: 'json' }
// import rawTags from './tags.json' with { type: 'json' }

import { User } from '../models/user.js'
import { Task } from '../models/task.js'
// import { Tag } from '../models/tag.js'

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

export { users, tasks }
