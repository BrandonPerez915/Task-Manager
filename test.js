import { User } from './BACKEND/models/user.js'
import { Task } from './BACKEND/models/task.js'
import { Tag } from './BACKEND/models/tag.js'

let passed = 0
let failed = 0

function test(description, fn) {
  try {
    fn()
    console.log(`  ✅ ${description}`)
    passed++
  } catch (e) {
    console.log(`  ❌ ${description}`)
    console.log(`     → ${e.message}`)
    failed++
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed')
}

function assertThrows(fn, message) {
  try {
    fn()
    throw new Error(message || 'Expected an exception but none was thrown')
  } catch (e) {
    if (
      e.message === (message || 'Expected an exception but none was thrown')
    ) {
      throw e
    }
  }
}

// ===================== USER TESTS =====================
console.log('\n🧑 User')

test('creates a user with valid data', () => {
  const u = new User('Brandon', 'brandon@test.com', 'password123')
  assert(u.name === 'Brandon')
  assert(u.email === 'brandon@test.com')
  assert(u.password === 'password123')
  assert(typeof u.id === 'number')
  assert(u.joined_at instanceof Date)
})

test('auto-increments user id', () => {
  const u1 = new User('A', 'a@test.com', 'password123')
  const u2 = new User('B', 'b@test.com', 'password123')
  assert(u2.id === u1.id + 1, `Expected ${u1.id + 1}, got ${u2.id}`)
})

test('throws on empty name', () => {
  assertThrows(() => new User('', 'x@test.com', 'password123'))
})

test('throws on null name', () => {
  assertThrows(() => new User(null, 'x2@test.com', 'password123'))
})

test('throws on empty email', () => {
  assertThrows(() => new User('Name', '', 'password123'))
})

test('throws on duplicate email', () => {
  const u = new User('User1', 'dup@test.com', 'password123')
  assertThrows(() => new User('User2', 'dup@test.com', 'password123'))
})

test('throws on password shorter than 8 characters', () => {
  assertThrows(() => new User('Name', 'short@test.com', '1234567'))
})

test('allows password of exactly 8 characters', () => {
  const u = new User('Name', 'exact8@test.com', '12345678')
  assert(u.password === '12345678')
})

test('can update name', () => {
  const u = new User('Old', 'upd@test.com', 'password123')
  u.name = 'New'
  assert(u.name === 'New')
})

test('can update email to a new unique email', () => {
  const u = new User('Name', 'old@test.com', 'password123')
  u.email = 'new@test.com'
  assert(u.email === 'new@test.com')
})

test('can update password', () => {
  const u = new User('Name', 'pwd@test.com', 'password123')
  u.password = 'newpass12'
  assert(u.password === 'newpass12')
})

test('throws on updating name to empty', () => {
  const u = new User('Name', 'up2@test.com', 'password123')
  assertThrows(() => {
    u.name = ''
  })
})

test('throws on updating password to short value', () => {
  const u = new User('Name', 'up3@test.com', 'password123')
  assertThrows(() => {
    u.password = '123'
  })
})

// ===================== TAG TESTS =====================
console.log('\n🏷️  Tag')

test('creates a tag with valid data', () => {
  const t = new Tag('Urgent', '#FF0000')
  assert(t.name === 'Urgent')
  assert(t.color === '#FF0000')
  assert(typeof t.id === 'number')
})

test('auto-increments tag id', () => {
  const t1 = new Tag('A', '#AAA')
  const t2 = new Tag('B', '#BBB')
  assert(t2.id === t1.id + 1)
})

test('accepts 3-char hex color', () => {
  const t = new Tag('Short', '#FFF')
  assert(t.color === '#FFF')
})

test('accepts 6-char hex color', () => {
  const t = new Tag('Long', '#ABCDEF')
  assert(t.color === '#ABCDEF')
})

test('accepts color without # prefix', () => {
  const t = new Tag('NoHash', 'abc')
  assert(t.color === '#abc')
})

test('throws on empty tag name', () => {
  assertThrows(() => new Tag('', '#FFF'))
})

test('throws on null tag name', () => {
  assertThrows(() => new Tag(null, '#FFF'))
})

test('throws on empty color', () => {
  assertThrows(() => new Tag('Name', ''))
})

test('throws on null color', () => {
  assertThrows(() => new Tag('Name', null))
})

test('throws on invalid hex length (4 chars)', () => {
  assertThrows(() => new Tag('Name', '#ABCD'))
})

test('throws on invalid hex characters', () => {
  assertThrows(() => new Tag('Name', '#GGG'))
})

test('can update tag name', () => {
  const t = new Tag('Old', '#FFF')
  t.name = 'New'
  assert(t.name === 'New')
})

test('can update tag color', () => {
  const t = new Tag('Name', '#FFF')
  t.color = '#000'
  assert(t.color === '#000')
})

test('throws on updating name to empty', () => {
  const t = new Tag('Name', '#FFF')
  assertThrows(() => {
    t.name = ''
  })
})

// ===================== TASK TESTS =====================
console.log('\n📋 Task')

const futureDate = new Date(Date.now() + 86400000)

test('creates a task with valid data', () => {
  const t = new Task('My Task', 'Description', futureDate, 1)
  assert(t.title === 'My Task')
  assert(t.description === 'Description')
  assert(t.due_date instanceof Date)
  assert(t.owner === 1)
  assert(t.status === 'A')
  assert(Array.isArray(t.tags))
  assert(typeof t.id === 'number')
})

test('auto-increments task id', () => {
  const t1 = new Task('T1', 'D', futureDate, 1)
  const t2 = new Task('T2', 'D', futureDate, 1)
  assert(t2.id === t1.id + 1)
})

test('accepts date string for due_date', () => {
  const t = new Task('T', 'D', '2027-01-01', 1)
  assert(t.due_date instanceof Date)
})

test('defaults status to A', () => {
  const t = new Task('T', 'D', futureDate, 1)
  assert(t.status === 'A')
})

test('defaults tags to empty array', () => {
  const t = new Task('T', 'D', futureDate, 1)
  assert(t.tags.length === 0)
})

test('accepts status F', () => {
  const t = new Task('T', 'D', futureDate, 1, 'F')
  assert(t.status === 'F')
})

test('accepts status C', () => {
  const t = new Task('T', 'D', futureDate, 1, 'C')
  assert(t.status === 'C')
})

test('accepts tags array', () => {
  const t = new Task('T', 'D', futureDate, 1, 'A', [1, 2])
  assert(t.tags.length === 2)
})

test('throws on empty title', () => {
  assertThrows(() => new Task('', 'D', futureDate, 1))
})

test('throws on null title', () => {
  assertThrows(() => new Task(null, 'D', futureDate, 1))
})

test('throws on invalid date', () => {
  assertThrows(() => new Task('T', 'D', 'not-a-date', 1))
})

test('throws on null owner', () => {
  assertThrows(() => new Task('T', 'D', futureDate, null))
})

test('throws on string owner', () => {
  assertThrows(() => new Task('T', 'D', futureDate, 'abc'))
})

test('throws on invalid status', () => {
  assertThrows(() => new Task('T', 'D', futureDate, 1, 'X'))
})

test('throws on tags not being an array', () => {
  assertThrows(() => new Task('T', 'D', futureDate, 1, 'A', 'not-array'))
})

test('can update title', () => {
  const t = new Task('Old', 'D', futureDate, 1)
  t.title = 'New'
  assert(t.title === 'New')
})

test('can update description', () => {
  const t = new Task('T', 'Old', futureDate, 1)
  t.description = 'New'
  assert(t.description === 'New')
})

test('can update due_date', () => {
  const t = new Task('T', 'D', futureDate, 1)
  const newDate = new Date('2028-06-15')
  t.due_date = newDate
  assert(t.due_date.getTime() === newDate.getTime())
})

test('can update status', () => {
  const t = new Task('T', 'D', futureDate, 1)
  t.status = 'F'
  assert(t.status === 'F')
})

test('can update tags', () => {
  const t = new Task('T', 'D', futureDate, 1)
  t.tags = [5, 6, 7]
  assert(t.tags.length === 3)
})

test('throws on updating title to empty', () => {
  const t = new Task('T', 'D', futureDate, 1)
  assertThrows(() => {
    t.title = ''
  })
})

test('throws on updating status to invalid value', () => {
  const t = new Task('T', 'D', futureDate, 1)
  assertThrows(() => {
    t.status = 'Z'
  })
})

// ===================== SUMMARY =====================
console.log(
  `\n📊 Results: ${passed} passed, ${failed} failed, ${passed + failed} total\n`,
)
process.exit(failed > 0 ? 1 : 0)
