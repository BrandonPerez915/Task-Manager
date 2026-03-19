class UserException extends Error {
  constructor(errorMessage) {
    super(errorMessage)
    this.name
  }
}

class User {
  #id
  #name
  #email
  #password
  #joined_at

  static #usedEmails = new Set()

  constructor(name, email, password) {
    this.#id = getNextUserId()
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

  set name(value) {
    if (!value || value.trim().length === 0) {
      throw new UserException('El nombre no puede estar vacío.')
    }
    this.#name = value
  }

  set email(value) {
    if (!value || value.trim().length === 0) {
      throw new UserException('El email no puede estar vacío.')
    }
    if (User.#usedEmails.has(value) && value !== this.#email) {
      throw new UserException('Este email ya está en uso por otro usuario.')
    }

    User.#usedEmails.delete(this.#email)
    this.#email = value
    User.#usedEmails.add(value)
  }

  set password(value) {
    if (!value || value.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres.')
    }
    this.#password = value
  }

  toObj() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      joinet_at: this.joined_at,
    }
  }
}
export { User }
