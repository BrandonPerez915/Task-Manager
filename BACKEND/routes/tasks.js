import { Router } from 'express'

import { users, tasks } from '../database/storage.js'

import { matchUserPassword, requireTask, requireTaskProps } from './middlewares.js'
import * as tasksController from '../controllers/tasks_controller.js'

const tasksRouter = Router()
const matchUser = matchUserPassword(users)
const requiredTask = requireTask(tasks)

tasksRouter.route('/')
  .post(matchUser, tasksController.postTask)
  .get(matchUser, tasksController.getTasks)

tasksRouter.route('/:id')
  .get(matchUser, requiredTask, tasksController.getTask)
  .patch(matchUser, requiredTask, requireTaskProps, tasksController.patchTask)
  .delete(matchUser, requiredTask, tasksController.deleteTask)

export { tasksRouter }
