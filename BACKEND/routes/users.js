import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

import * as usersController from '../controllers/users_controller.js'

const usersRouter = express.Router()

usersRouter.post('/', usersController.registerUser)

export { usersRouter }
