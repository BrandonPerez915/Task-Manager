import { Router } from 'express'

import { users } from '../database/storage.js'

import { requireAdmin, requireUser, requireUserProps } from './middlewares.js'
import * as userController from '../controllers/users_controller.js'

const usersRouter = Router()
const requiredUser = requireUser(users)

usersRouter.route('/')
  .post(userController.postUser)
  .get(requireAdmin, userController.getUsers)

usersRouter.route('/:id')
  .get(requiredUser, userController.getUser)
  .patch(requiredUser, requireUserProps, userController.patchUser)
  .delete(requiredUser, userController.deleteUser)

export { usersRouter }
