import { readJsonFile, writeJsonFile, generateId } from '../../utils/db'
import type { Favorite } from '../../types'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { userId, movieId } = body

  if (!userId || !movieId) {
    throw createError({
      statusCode: 400,
      message: 'userId et movieId sont requis'
    })
  }

  const favorites = await readJsonFile<Favorite[]>('favorites.json')

  // Vérifier si le favori existe déjà
  const existingFavorite = favorites.find(
    f => f.userId === userId && f.movieId === movieId
  )

  if (existingFavorite) {
    throw createError({
      statusCode: 409,
      message: 'Ce film est déjà dans vos favoris'
    })
  }

  // Ajouter le nouveau favori
  const newFavorite: Favorite = {
    id: generateId(favorites),
    userId,
    movieId,
    createdAt: new Date().toISOString()
  }

  favorites.push(newFavorite)
  await writeJsonFile('favorites.json', favorites)

  return newFavorite
})
