import { readJsonFile } from '../../utils/db'
import type { Favorite } from '../../types'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const userId = parseInt(query.userId as string)

  if (!userId) {
    throw createError({
      statusCode: 400,
      message: 'ID utilisateur requis'
    })
  }

  const favorites = await readJsonFile<Favorite[]>('favorites.json')
  const userFavorites = favorites.filter(f => f.userId === userId)

  return userFavorites
})
