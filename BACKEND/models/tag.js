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
  #userId

  constructor(id, name, color, userId) {
    this.#id = id
    this.#userId = userId

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

  get userId() {
    return this.#userId
  }

  set name(name) {
    if (!name || name.trim() === '') {
      throw new TagException('Es necesario proporcionar un nombre pra la etiqueta')
    }
    this.#name = name
  }

  set color(color) {
    if (!color)
      throw new TagException('Es necesario proporcionar un color para la etiqueta')

    const cleanColor = color.startsWith('#') ? color.substring(1) : color

    if (cleanColor.length !== 6) {
      throw new TagException('Formato incorrecto: EL color debe ser un hexadecimal de 6 caracteres')
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
      id: this.#id,
      name: this.#name,
      color: this.#color,
      userId: this.#userId
    }
  }
}

export { Tag }
