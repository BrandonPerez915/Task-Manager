import { Router } from 'express'

import { users, tags } from '../database/storage.js'

import { matchUserPassword, requireTag, requireTagProps } from './middlewares.js'
import * as tagsController from '../controllers/tags_controller.js'

const tagsRouter = Router()
const matchUser = matchUserPassword(users)
const requiredTag = requireTag(tags)

tagsRouter.route('/')
  .post(matchUser, tagsController.postTag)
  .get(matchUser, tagsController.getTags)

tagsRouter.route('/:id')
  .get(matchUser, requiredTag, tagsController.getTag)
  .patch(matchUser, requiredTag, requireTagProps, tagsController.patchTag)
  .delete(matchUser, requiredTag, tagsController.deleteTag)

export { tagsRouter }
