class UserException extends Error {
  constructor(errorMessage) {
    super(errorMessage)
    this.name = 'UserException'
  }
}

class User {
  #id
  #name
  #email
  #password
  #joinedAt

  constructor(id, name, email, password, confirmPassword) {
    if (!id ||typeof id !== 'number') throw new UserException('ID requerido')

    this.#id = id
    this.#joinedAt = new Date().toString()

    this.name = name
    this.email = email
    this.password = password

    if (!confirmPassword) throw new UserException('Es necesario confirmar la contraseña')
    if (password !== confirmPassword) throw new UserException('Las contraseñas no coinciden')
  }

  get id() {
    return this.#id
  }
  get joinedAt() {
    return this.#joinedAt
  }
  get name() {
    return this.#name
  }
  get email() {
    return this.#email
  }
  get password() {
    return this.#password
  }

  set name(name) {
    if (!name || name.trim().length === 0) {
      throw new UserException('Es necesario proporcionar un nombre de usuario.')
    }
    this.#name = name
  }

  set email(email) {
    if (!email || email.trim().length === 0) {
      throw new UserException('Es necesario proporcionar un email.')
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new UserException('El email no tiene un formato válido.')
    }

    this.#email = email
  }

  set password(password) {
    if (!password) {
      throw new UserException('Es necesario proporcionar una contraseña.')
    }

    if (password.length < 8) {
      throw new UserException('La contraseña debe tener al menos 8 caracteres.')
    }

    this.#password = password
  }

  toObj() {
    return {
      id: this.#id,
      name: this.#name,
      email: this.#email,
      password: this.#password,
      joined_at: this.#joinedAt
    }
  }
}

export { User }
