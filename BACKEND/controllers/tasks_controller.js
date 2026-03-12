import { Task } from '../models/task.js'
import { data } from '../db.js'

function createTask(
  title,
  description,
  due_date,
  owner,
  status = 'A',
  tags = [],
) {
  data.tasks.push(new Task(title, description, due_date, owner, status, tags))
}

function getTaskById(id) {
  let task = data.tasks.find((task) => task.id === id)

  if (!task) throw new Error('404 - Task not found')
  else return task
}

function searchTasks(attribute, value) {
  if (data.tasks.length === 0) return []
  const firstTask = data.tasks[0]

  if (!(attribute in firstTask)) {
    throw new Error(`El atributo "${attribute}" no existe en la clase Task.`)
  }

  return data.tasks.filter((task) => {
    const taskValue = task[attribute]

    if (taskValue instanceof Date) {
      const searchDate = new Date(value).getTime()
      return taskValue.getTime() === searchDate
    }

    if (typeof taskValue === 'string') {
      return taskValue.toLowerCase().includes(String(value).toLowerCase())
    }

    if (attribute === 'tags') {
      return taskValue.some((tagId) => tagId === value)
    }

    return taskValue == value
  })
}

function getAllTasks() {
  return data.tasks
}

function updateTask(id, newInfo) {
  let task = data.tasks.find((task) => task.id === id)

  if (!task) {
    throw new Error('404 - Task not found')
  }

  const validAttributes = [
    'title',
    'description',
    'due_date',
    'owner',
    'status',
    'tags',
  ]
  let updatedCount = 0

  for (let key in newInfo) {
    if (validAttributes.includes(key)) {
      // Propagación de posibles errores en los setters de Task
      try {
        task[key] = newInfo[key]
        updatedCount++
      } catch (error) {
        throw new Error(`Error al actualizar la tarea: ${error.message}`)
      }
    }
  }

  if (updatedCount === 0) {
    throw new Error('Ningún atributo válido para actualizar task')
  }

  return true
}

function deleteTask(id) {
  const taskIndex = data.tasks.findIndex((task) => task.id === id)

  if (taskIndex === -1) {
    throw new Error('404 - Task not found')
  }

  data.tasks.splice(taskIndex, 1)
  return true
}

export {
  createTask,
  getTaskById,
  searchTasks,
  getAllTasks,
  updateTask,
  deleteTask,
}
