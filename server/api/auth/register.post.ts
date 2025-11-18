import { readJsonFile, writeJsonFile, generateId } from '../../utils/db'
import type { User, UserPublic, AuthResponse } from '../../types'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, email, password, firstName, lastName } = body

  // Validation
  if (!username || !email || !password || !firstName || !lastName) {
    throw createError({
      statusCode: 400,
      message: 'Tous les champs sont requis'
    })
  }

  // Vérifier si l'utilisateur existe déjà
  const users = await readJsonFile<User[]>('users.json')
  const existingUser = users.find(u => u.email === email || u.username === username)

  if (existingUser) {
    throw createError({
      statusCode: 409,
      message: 'Cet email ou nom d\'utilisateur est déjà utilisé'
    })
  }

  // Créer le nouvel utilisateur
  const newUser: User = {
    id: generateId(users),
    username,
    email,
    password, // En production, il faudrait hasher le mot de passe
    firstName,
    lastName,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    createdAt: new Date().toISOString()
  }

  users.push(newUser)
  await writeJsonFile('users.json', users)

  // Retourner l'utilisateur sans le mot de passe
  const userPublic: UserPublic = {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    avatar: newUser.avatar,
    createdAt: newUser.createdAt
  }

  // Simuler un token JWT (en production, utiliser un vrai JWT)
  const token = `fake-jwt-token-${newUser.id}-${Date.now()}`

  const response: AuthResponse = {
    user: userPublic,
    token
  }

  return response
})
