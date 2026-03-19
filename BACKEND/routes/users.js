import express from 'express'

import * as controller from '../controllers/users_controller.js'

const usersRouter = express.Router()

usersRouter.post('/', controller.postUser)

usersRouter.get('/', controller.getUsers)

usersRouter.get('/:id', controller.userAuth, controller.getUser)

usersRouter.patch('/:id', controller.userAuth, controller.patchUser)

usersRouter.delete('/:id', controller.userAuth, controller.deleteUser)

export { usersRouter }
