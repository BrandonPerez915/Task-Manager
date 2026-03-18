import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

import * as usersController from '../controllers/users_controller'

const usersRouter = express.Router

usersRouter.post('/', usersController.createUser)

export { usersRouter }
