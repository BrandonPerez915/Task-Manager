import { User } from '../models/user.js'
import { data } from '../db.js'

function createUser(name, email, password) {
  data.users.push(new User(name, email, password))
}

function getUserById(id) {
  let user = data.users.find((user) => user.id === id)

  if (!user) throw new Error('404 - User not found')
  else return user
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

export {
  createUser,
  getUserById,
  searchUsers,
  getAllUsers,
  updateUser,
  deleteUser,
}
