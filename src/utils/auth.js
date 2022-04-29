import config from '../config'
import jwt from 'jsonwebtoken'
import { UserModel } from '../resources/user/model'

export const newToken = user => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp
  })
}

export const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

export const signup = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    res
      .status(400)
      .send({ message: 'You must provide an email and a password' })
    return
  }
  const User = new UserModel()
  if (User.findByEmail(email)) {
    res.status(400).send({ message: 'That email is already taken' })
    return
  }
  const user = User.create({
    email,
    password: await User.hashPassword(password)
  })
  const token = newToken(user)
  res.status(201).send({ token })
}

export const signin = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    res
      .status(400)
      .send({ message: 'You must provide an email and a password' })
    return
  }
  const User = new UserModel()
  const user = User.findByEmail({ email })
  if (!user) return res.status(401).send({ message: 'User not found' })
  const isValid = await user.checkPassword(user.id, password)
  if (!isValid) return res.status(400).send({ message: 'Invalid credentials' })
  const token = newToken(user)
  res.send({ token })
}

export const protect = async (req, res, next) => {
  const token = req.headers.authorization
  if (!token) return res.status(401).end({ message: 'No token provided' })
  try {
    const payload = await verifyToken(token.slice(7))
    req.user = payload
    next()
  } catch (err) {
    res.status(401).end({ message: 'Invalid token' })
  }
}
