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
  #joined_at

  constructor(id, name, email, password) {
    if (typeof id !== 'number') throw new UserException('ID requerido')

    this.#id = id
    this.#joined_at = new Date()

    this.name = name
    this.email = email
    this.password = password
  }

  get id() {
    return this.#id
  }
  get joined_at() {
    return this.#joined_at
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
      throw new UserException('El nombre no puede estar vacío.')
    }
    this.#name = name
  }

  set email(email) {
    if (!email || email.trim().length === 0) {
      throw new UserException('El email no puede estar vacío.')
    }

    this.#email = email
  }

  set password(password) {
    if (!password || password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres.')
    }

    this.#password = password
  }

  toObj() {
    return {
      id: this.#id,
      name: this.#name,
      email: this.#email,
      password: this.#password,
      joined_at: this.#joined_at,
    }
  }
}

export { User }
