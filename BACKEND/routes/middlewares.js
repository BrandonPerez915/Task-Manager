
function requireAuthField(req, res, next) {
  if (!req.get('x-auth')) {
    return res.status(400).send('Usuario no autorizado')
  }
  return next()
}

function requireSession(req, res, next) {
  if (!req.get('x-auth')) {
    return res.redirect('/login.html')
  }
  return next()
}

function requireAdmin(req, res, next) {
  const auth = req.get('x-auth')
  if (!auth || auth !== 'admin_auth')
    return res.status(401).send('Usuario no autorizado')

  return next()
}

function requireUser(users) {
  return (req, res, next) => {
    const userId = parseInt(req.params.id)
    const user = users.find(user => user.id === userId)

    if (!userId)
      return res.status(400).send('Es necesario proporcionar el id de algun usuario existente')
    if (!user)
      return res.status(404).send('El id proporcionado no corresponde a ningun usuario')

    const auth = req.get('x-auth')
    if (!auth || user.password !== auth)
      return res.status(401).send('Usuario no autorizado')

    req.user = user
    return next()
  }

}

function requireUserProps(req, res, next) {
  const user = req.user
  const properties = Object.keys(req.body).filter(prop => prop in user)

  if (properties.length === 0)
    return res.status(400).send('No se proporcionaron propiedades validas para modificar')

  req.properties = properties
  return next()
}

function matchUserPassword(users) {
  return (req, res, next) => {
    const auth = req.get('x-auth')
    const userId = users.find(user => user.password === auth)?.id

    if (!userId) return res.status(400).send('Usuario no encontrado')

    req.userId = userId
    return next()
  }

}

function requireTask(tasks) {
  return (req, res, next) => {
    const userId = req.userId
    const taskId = parseInt(req.params.id)

    const task = tasks.find(task => task.id === taskId)

    if (!task || task.userId !== userId)
      return res.status(404).send(`El id proporcionado no corresponde a ninguna tarea perteneciente al usuario con id ${userId}`)

    req.task = task
    return next()
  }
}

function requireTaskProps(req, res, next) {
  const task = req.task
  const properties = Object.keys(req.body).filter(prop => prop in task)

  if (properties.length === 0)
    return res.status(400).send('No se proporcionaron propiedades validas para modificar')

  req.properties = properties
  return next()
}

function requireTag(tags) {
  return (req, res, next) => {
    const userId = req.userId
    const tagId = parseInt(req.params.id)

    const tag = tags.find(tag => tag.id === tagId)

    if (!tag || tag.userId !== userId)
      return res.status(404).send(`El id proporcionado no corresponde a ninguna etiqueta perteneciente al usuario con id ${userId}`)

    req.tag = tag
    return next()
  }
}

function requireTagProps(req, res, next) {
  const tag = req.tag
  const properties = Object.keys(req.body).filter(prop => prop in tag)

  if (properties.length === 0)
    return res.status(400).send('No se proporcionaron propiedades validas para modificar')

  req.properties = properties
  return next()
}

export {
  requireAuthField,
  requireSession,
  requireAdmin,
  requireUser,
  requireUserProps,
  matchUserPassword,
  requireTask,
  requireTaskProps,
  requireTag,
  requireTagProps
}
