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
  #dueDate
  #userId
  #status
  #tags

  constructor(id, title, description, dueDate, userId, status = 'A', tags = []) {
    this.#id = id
    if (!id ||typeof id !== 'number') throw new TaskException('ID requerido')

    this.title = title
    this.#description = description
    this.dueDate = dueDate
    this.userId = userId
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
  get dueDate() {
    return this.#dueDate
  }
  get userId() {
    return this.#userId
  }
  get status() {
    return this.#status
  }
  get tags() {
    return this.#tags
  }

  set title(title) {
    if (!title || title.trim() === '') {
      throw new TaskException('Es necesario proporcionar un titulo')
    }
    this.#title = title
  }

  set description(value) {
    this.#description = value
  }

  set dueDate(date) {
    const dateValue = new Date(date)

    if (!(dateValue instanceof Date) || isNaN(dateValue.getTime())) {
      throw new TaskException('Es necesario proporcionar una fecha valida')
    }
    this.#dueDate = dateValue
  }

  set userId(value) {
    if (!value || typeof value !== 'number') {
      throw new TaskException('Es necesario proporcionar un usuario valido')
    }
    this.#userId = value
  }

  set status(value) {
    const validStatus = ['A', 'F', 'C']
    if (!validStatus.includes(value)) {
      throw new TaskException('El status debe ser A (Active), F (Finished) o C (Cancelled)')
    }
    this.#status = value
  }

  set tags(value) {
    if (!Array.isArray(value)) {
      throw new TaskException('Tags debe ser un arreglo')
    }
    this.#tags = value
  }

  toObj() {
    return {
      id: this.#id,
      title: this.#title,
      description: this.#description,
      dueDate: this.#dueDate.toISOString(),
      userId: this.#userId,
      status: this.#status,
      tags: this.#tags
    }
  }
}

export { Task }
