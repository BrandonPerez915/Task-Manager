import { Router, static as staticFile } from 'express'
import  path  from 'path'
import { fileURLToPath } from 'url'

import { usersRouter } from './users.js'
import { tagsRouter } from './tags.js'
import { tasksRouter } from './tasks.js'

import { requireSession, requireAuthField } from './middlewares.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const apiRouter = Router()

const VIEWS_PATH = path.join(__dirname, '/../../FRONTEND/views')

// Archivos estaticos (estilos y imagenes)
apiRouter.use('/styles', staticFile(path.join(VIEWS_PATH, 'styles')))
apiRouter.use('/assets', staticFile(path.join(VIEWS_PATH, 'assets')))

apiRouter.use('/users', usersRouter)
apiRouter.use('/tags', tagsRouter)
apiRouter.use('/tasks', tasksRouter)

apiRouter.get('/login.html', (req, res) => {
  res.sendFile(path.join(VIEWS_PATH, 'login.html'))
})

apiRouter.get('/', requireSession, (req, res) => {
  if (res.statusCode === 401) res.redirect('/login.html')
  else res.sendFile(path.join(VIEWS_PATH, 'home.html'))
})

apiRouter.get('/tasks.html', requireAuthField, (req, res) => {
  res.sendFile(path.join(VIEWS_PATH, 'tasks.html'))
})

apiRouter.get('/home.html', requireAuthField, (req, res) => {
  res.sendFile(path.join(VIEWS_PATH, 'home.html'))
})

export { apiRouter }
