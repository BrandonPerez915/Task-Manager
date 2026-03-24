import { Task } from '../models/task.js'

import { tasks, save, nextId } from '../database/storage.js'

function postTask(req, res) {
  const {
    title, description, dueDate, status, tags
  } = req.body

  let newTask
  try {
    newTask = new Task(
      nextId(tasks),
      title,
      description || ' ',
      dueDate || new Date().toISOString(),
      req.userId,
      status || 'A',
      tags || []
    )
  } catch (error) {
    return res.status(400).send(error.message)
  }

  tasks.push(newTask)
  save(tasks)

  return res.status(201).send('Tarea creada exitosamente')
}

function getTasks(req, res) {
  const userId = req.userId

  const filteredTasks = tasks.filter(task => task.userId === userId)

  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20

  const total = filteredTasks.length
  const start = (page - 1) * limit
  const end = start + limit

  const slicedTasks = filteredTasks.slice(start, end).map(task => task.toObj())

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
    tasks: slicedTasks
  })
}

function getTask(req, res) {
  return res.status(200).json(req.task.toObj())
}

function patchTask(req, res) {
  const task = req.task
  const properties = req.properties
  const backup = { ...task }

  try {
    properties.forEach(prop => task[prop] = req.body[prop])
  } catch (error) {
    Object.assign(task, backup) // Rollback
    return res.status(400).send(error.message)
  }

  save(tasks)
  return res.status(200).json({
    message: 'Tarea modificada con exito',
    task: task.toObj()
  })
}

function deleteTask(req, res) {
  const task = req.task
  const index = tasks.indexOf(task)
  tasks.splice(index, 1)

  save(tasks)

  return res.status(200).json({
    message: `Tarea con id ${task.id} perteneciente al usuario con id ${task.userId} eliminada`,
    task: task.toObj()
  })
}

export {
  postTask,
  getTasks,
  getTask,
  patchTask,
  deleteTask
}
