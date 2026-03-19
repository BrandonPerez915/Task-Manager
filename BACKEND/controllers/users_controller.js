import * as fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import data from '../database/users.json' with { type: 'json' }

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const usersFilePath = path.join(__dirname, '../database/users.json')

const saveData = () => {
  fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2))
}

export function postUser(req, res) {
  try {
    const { name, email, password, confirmPassword } = req.body
    if(!name) return res.status(400).send('Es necesario un nombre de usuario')
    if(!email) return res.status(400).send('Es necesario un correo')
    if(!password) return res.status(400).send('Es necesaria una contraseña')
    if(!confirmPassword) return res.status(400).send('Es necesario confrimar la contraseña')

    let emailExist = false
    let passwordExist = false

    for(let user of data.users) {
      if(user.email == email) {
        emailExist = true
        break
      }
      if(user.password == password) {
        passwordExist = true
        break
      }
    }

    if (emailExist)
      return res
        .status(400)
        .send('El email proporcionado ya esta vinculado a una cuenta')
      
    if (passwordExist)
      return res
        .status(400)
        .send('La contraseña se encuentra en uso, intente con una diferente')

    if (password !== confirmPassword) {
      return res.status(400).send('Las contraseñas no coinciden')
    }

    const newUser = {
      id: data.users.length + 1,
      name,
      email,
      password,
    }

    data.users.push(newUser)
    saveData()

    res.status(201).send('Usuario registrado exitosamente')
  } catch (error) {
    res.status(400).send(error.message)
  }
}

export function getUsers(req, res) {
  try {
    const auth = req.get('x-auth')
    if(!auth || auth !== 'admin-auth')
      return res.status(401).send('Usuario no autorizado')
    
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20

    const total = data.users.length
    const start = (page - 1) * limit
    const end = start + limit

    const users = data.users.slice(start, end)

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
      data: users
    })

  } catch(error) {
    res.status(400).send(error.message)
  }

}

export function userAuth(req, res, next) {
  const id = parseInt(req.params.id)
  let user = data.users.find((user) => user.id === id)

  if(!user) return res.status(404).send('El id proporcionado no corresponde a ningun usuario')

  const auth = req.get('x-auth')
  if(!auth || user.password != auth) 
    return res
      .status(401)
      .send('Usuario no autorizado')
  
  req.user = user
  next()
}

export function getUser(req, res) {
  res.status(200).json(req.user)
}

export function patchUser(req, res) {

}

function searchUsers(attribute, value) {
  if (data.users.length === 0) return []
  const firstUser = data.users[0]

  if (!(attribute in firstUser)) {
    throw new Error(`El atributo "${attribute}" no existe en la clase User.`)
  }

  return data.users.filter((user) => {
    const userValue = user[attribute]

    if (userValue instanceof Date) {
      const searchDate = new Date(value).getTime()
      return userValue.getTime() === searchDate
    }

    if (typeof userValue === 'string') {
      return userValue.toLowerCase().includes(String(value).toLowerCase())
    }

    return userValue == value
  })
}

function getAllUsers() {
  return data.users
}

function updateUser(id, newInfo) {
  const user = data.users.find((user) => user.id === id)

  if (!user) {
    throw new Error(`Id de usuario no encontrado: ${id}`)
  }

  const validAttributes = ['name', 'email', 'password']
  let updatedCount = 0

  for (let key in newInfo) {
    if (validAttributes.includes(key)) {
      // Propagación de posibles errores en los setters de User
      try {
        user[key] = newInfo[key]
        updatedCount++
      } catch (error) {
        throw new Error(
          `Error al actualizar el atributo ${key}: ${error.message}`,
        )
      }
    }
  }

  if (updatedCount === 0) {
    throw new Error('Ningun atributo válido para actualizar user')
  }

  return true
}

function deleteUser(id) {
  const index = data.users.findIndex((user) => user.id === id)

  if (index === -1) {
    throw new Error(`Id de usuario no encontrado: ${id}`)
  }

  data.users.splice(index, 1)
  return true
}
