import bcrypt from 'bcrypt'

export class UserModel {
  constructor() {
    this.users = []
  }

  create(user) {
    const newUser = {
      id: this.users.length + 1,
      email: user.email,
      password: user.password
    }
    this.users.push(newUser)
    return newUser
  }

  findById(id) {
    return this.users.find(user => user.id === id)
  }
  findByEmail(email) {
    return this.users.find(user => user.email === email)
  }

  checkPassword(id, password) {
    const user = this.findById(id)
    return bcrypt.compare(password, user.password)
  } // hint: make use of bcrypt to match password i.e: bcrypt.compare

  hashPassword(password) {
    return bcrypt.hash(password, 10)
  } // hint: make use of bcrypt to hash password i.e: bcrypt.hash
}
