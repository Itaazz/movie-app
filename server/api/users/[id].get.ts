import { readJsonFile } from '../../utils/db'
import type { User, UserPublic } from '../../types'

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'id') || '0')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID utilisateur invalide'
    })
  }

  const users = await readJsonFile<User[]>('users.json')
  const user = users.find(u => u.id === id)

  if (!user) {
    throw createError({
      statusCode: 404,
      message: 'Utilisateur non trouvé'
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

  return userPublic
})
