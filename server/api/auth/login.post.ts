import { readJsonFile } from '../../utils/db'
import type { User, UserPublic, AuthResponse } from '../../types'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  // Validation
  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: 'Email et mot de passe requis'
    })
  }

  // Trouver l'utilisateur
  const users = await readJsonFile<User[]>('users.json')
  const user = users.find(u => u.email === email)

  if (!user || user.password !== password) {
    throw createError({
      statusCode: 401,
      message: 'Email ou mot de passe incorrect'
    })
  }

  // Retourner l'utilisateur sans le mot de passe
  const userPublic: UserPublic = {
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatar,
    createdAt: user.createdAt
  }

  // Simuler un token JWT
  const token = `fake-jwt-token-${user.id}-${Date.now()}`

  const response: AuthResponse = {
    user: userPublic,
    token
  }

  return response
})
