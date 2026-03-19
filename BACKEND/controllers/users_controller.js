import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

import { User } from '../models/user.js'
import rawData from '../database/users.json' with { type: 'json' }

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const usersFilePath = path.join(__dirname, '../database/users.json')

let users = rawData.users.map((object) => {
  return new User(object.id, object.name, object.email, object.password)
})

function saveUsers() {
  const data = {
    users: users.map((user) => user.toObj()),
  }

  fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2))
}

function nextId() {
  if (users.length === 0) return 1

  const maxId = Math.max(...users.map((user) => user.id))
  return maxId + 1
}

function postUser(req, res) {
  try {
    const { name, email, password, confirmPassword } = req.body

    if (password !== confirmPassword) {
      return res.status(400).send('Las contraseñas no coinciden')
    }

    if (users.some((user) => user.email === email)) {
      return res
        .status(400)
        .send('El email proporcionado se encuentra en uso, inicie sesion')
    }
    if (users.some((user) => user.password === password)) {
      return res
        .status(400)
        .send('La contraseña proporcionada se encuentra en uso')
    }

    const userId = nextId()
    const newUser = new User(userId, name, email, password)

    users.push(newUser)
    saveUsers()

    res.status(201).send('Usuario registrado exitosamente')
  } catch (error) {
    res.status(400).send(error.message)
  }
}

function getUsers(req, res) {
  try {
    const auth = req.get('x-auth')
    if (!auth || auth !== 'admin-auth')
      return res.status(401).send('Usuario no autorizado')

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20

    const total = users.length
    const start = (page - 1) * limit
    const end = start + limit

    const slicedUsers = users.slice(start, end).map((user) => user.toObj())

    const nextPage = end < total ? page + 1 : null
    const prevPage = page > 1 ? page - 1 : null
    const totalPages = Math.ceil(total / limit)

    res.status(201).json({
      page,
      limit,
      total,
      start,
      end,
      nextPage,
      prevPage,
      totalPages,
      data: slicedUsers,
    })
  } catch (error) {
    res.status(400).send(error.message)
  }
}

// Middleware para autentificacion de id cuando se pasa por parametro en la url
function userAuth(req, res, next) {
  const id = parseInt(req.params.id)
  let user = users.find((user) => user.id === id)

  if (!user)
    return res
      .status(404)
      .send('El id proporcionado no corresponde a ningun usuario')

  const auth = req.get('x-auth')
  if (!auth || user.password != auth)
    return res.status(401).send('Usuario no autorizado')

  req.user = user
  next()
}

function getUser(req, res) {
  res.status(200).json(req.user.toObj())
}

function patchUser(req, res) {
  let properties = Object.keys(req.body)
  const user = req.user
  // Snapshot para protegerse de exepciones en setters
  const backup = { ...user }
  properties = properties.filter((prop) => prop in user)

  if (properties.length === 0)
    return res
      .status(400)
      .send('No se proporcionaron propiedades validas para modificar')

  try {
    for (let prop of properties) {
      user[prop] = req.body[prop]
    }
  } catch (error) {
    // rollback, la accion se hace o no se hace, no hay un punto medio
    Object.assign(user, backup)
    res.status(400).send(error.message)
  }

  saveUsers()
  res.status(200).json({
    message: 'Usuario modificado',
    user: user.toObj(),
  })
}

function deleteUser(req, res) {
  const user = req.user

  const index = users.indexOf(user)
  users.splice(index, 1)

  res.status(200).json({
    message: `usuario con id ${user.id} eliminado`,
    user: user.toObj(),
  })

  saveUsers()
}

export {
  postUser,
  getUsers,
  getUser,
  userAuth,
  patchUser,
  deleteUser,
  nextId,
  users,
}
