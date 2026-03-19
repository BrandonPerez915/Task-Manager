import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

import { usersRouter } from './users.js'
import { tagsRouter } from './tags.js'
import { tasksRouter } from './tasks.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const apiRouter = express.Router()

const VIEWS_PATH = path.join(__dirname, '/../../FRONTEND/views')

// Middlewares
function authRedirect(req, res, next) {
  if (!req.get('Auth')) return res.redirect('/login.html')

  next()
}

function auth401(req, res, next) {
  if (!req.get('Auth')) return res.sendStatus(401)

  next()
}
// Archivos estaticos (estilos y imagenes)
apiRouter.use('/styles', express.static(path.join(VIEWS_PATH, 'styles')))
apiRouter.use('/assets', express.static(path.join(VIEWS_PATH, 'assets')))

apiRouter.use('/users', usersRouter)
apiRouter.use('/tags', tagsRouter)
apiRouter.use('/tasks', tasksRouter)

apiRouter.get('/login.html', (req, res) => {
  res.sendFile(path.join(VIEWS_PATH, 'login.html'))
})

apiRouter.get('/', authRedirect, (req, res) => {
  if (res.statusCode == 401) res.redirect('/login.html')
  else res.sendFile(path.join(VIEWS_PATH, 'home.html'))
})

apiRouter.get('/tasks.html', auth401, (req, res) => {
  res.sendFile(path.join(__dirname, '/../../FRONTEND/views/tasks.html'))
})

apiRouter.get('/home.html', auth401, (req, res) => {
  res.sendFile(path.join(__dirname, '/../../FRONTEND/views/home.html'))
})

export { apiRouter }
