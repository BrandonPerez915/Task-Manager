import { save, nextId } from '../database/storageUtils.js'
import { users } from '../database/storage.js'

import { User } from '../models/user.js'

function postUser(req, res) {
  const { name, email, password, confirm_password } = req.body

  const userId = nextId(users)
  let newUser

  try {
    newUser = new User(userId, name, email, password, confirm_password)
  } catch (error) {
    return res.status(400).send(error.message)
  }

  if (users.some(user => user.email === email)) {
    return res
      .status(400)
      .send('El email proporcionado se encuentra en uso, inicie sesion')
  }
  if (users.some(user => user.password === password)) {
    return res
      .status(400)
      .send('La contraseña proporcionada se encuentra en uso')
  }

  users.push(newUser)
  save(users)

  return res.status(201).send('Usuario registrado exitosamente')
}

function getUsers(req, res) {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20

  const total = users.length
  const start = (page - 1) * limit
  const end = start + limit

  const slicedUsers = users.slice(start, end).map(user => user.toObj())

  const nextPage = end < total ? page + 1 : null
  const prevPage = page > 1 ? page - 1 : null
  const totalPages = Math.ceil(total / limit)

  res.status(200).json({
    page,
    limit,
    total,
    start,
    end,
    nextPage,
    prevPage,
    totalPages,
    data: slicedUsers
  })
}

function getUser(req, res) {
  res.status(200).json(req.user.toObj())
}

function patchUser(req, res) {
  const user = req.user
  const properties = req.properties
  const backup = { ...user }

  try {
    properties.forEach(prop => user[prop] = req.body[prop])
  } catch (error) {
    Object.assign(user, backup) // Rollback
    return res.status(400).send(error.message)
  }

  save(users)
  return res.status(200).json({
    message: 'Usuario modificado con exito',
    user: user.toObj()
  })
}

function deleteUser(req, res) {
  const user = req.user

  const index = users.indexOf(user)
  users.splice(index, 1)

  res.status(200).json({
    message: `usuario con id ${user.id} eliminado`,
    user: user.toObj()
  })

  save(users)
}

export {
  postUser,
  getUsers,
  getUser,
  patchUser,
  deleteUser
}
