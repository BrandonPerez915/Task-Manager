let currentTagId = 0
function getNextTagId() {
  return ++currentTagId
}

class TagException extends Error {
  constructor(errorMessage) {
    super(errorMessage)
    this.name = 'TagException'
  }
}

class Tag {
  #id
  #name
  #color

  constructor(name, color) {
    this.#id = getNextTagId()

    this.name = name
    this.color = color
  }

  get id() {
    return this.#id
  }
  get name() {
    return this.#name
  }
  get color() {
    return this.#color
  }

  set name(value) {
    if (!value || value.trim() === '') {
      throw new TagException('El nombre del tag no puede estar vacío')
    }
    this.#name = value
  }

  set color(value) {
    if (!value) throw new TagException('El tag debe tener un color')

    const cleanColor = value.startsWith('#') ? value.substring(1) : value

    if (cleanColor.length !== 3 && cleanColor.length !== 6) {
      throw new TagException('El color hexadecimal debe tener 3 o 6 caracteres')
    }

    const validChars = '0123456789ABCDEFabcdef'
    for (const char of cleanColor) {
      if (validChars.indexOf(char) === -1) {
        throw new TagException(
          'Formato incorrecto: el color debe ser hexadecimal'
        )
      }
    }

    this.#color = `#${cleanColor}`
  }

  toObj() {
    return {
      id: this.id,
      name: this.name,
      color: this.color
    }
  }
}

export { Tag }
