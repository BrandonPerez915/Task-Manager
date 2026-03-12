let currentTaskId = 0
function getNextTaskId() {
  return ++currentTaskId
}

class TaskException extends Error {
  constructor(errorMessage) {
    super(errorMessage)
    this.name = 'TaskException'
  }
}

class Task {
  #id
  #title
  #description
  #due_date
  #owner
  #status
  #tags

  constructor(title, description, due_date, owner, status = 'A', tags = []) {
    this.#id = getNextTaskId()

    this.title = title
    this.description = description
    this.due_date = due_date
    this.owner = owner
    this.status = status
    this.tags = tags
  }

  get id() {
    return this.#id
  }
  get title() {
    return this.#title
  }
  get description() {
    return this.#description
  }
  get due_date() {
    return this.#due_date
  }
  get owner() {
    return this.#owner
  }
  get status() {
    return this.#status
  }
  get tags() {
    return this.#tags
  }

  set title(value) {
    if (!value || value.trim() === '') {
      throw new TaskException('El título no puede estar vacío')
    }
    this.#title = value
  }

  set description(value) {
    this.#description = value
  }

  set due_date(value) {
    let dateValue = value
    if (typeof value === 'string' || typeof value === 'number') {
      dateValue = new Date(value)
    }

    if (!(dateValue instanceof Date) || isNaN(dateValue.getTime())) {
      throw new TaskException('La fecha debe ser válida')
    }
    this.#due_date = dateValue
  }

  set owner(value) {
    if (!value || typeof value !== 'number') {
      throw new TaskException('El owner debe ser un ID de usuario válido')
    }
    this.#owner = value
  }

  set status(value) {
    const validStatus = ['A', 'F', 'C']
    if (!validStatus.includes(value)) {
      throw new TaskException(
        'El status debe ser A (Active), F (Finished) o C (Cancelled)',
      )
    }
    this.#status = value
  }

  set tags(value) {
    if (!Array.isArray(value)) {
      throw new TaskException('Tags debe ser un arreglo')
    }
    this.#tags = value
  }
}

export { Task }
