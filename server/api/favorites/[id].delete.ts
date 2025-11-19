import { readJsonFile, writeJsonFile } from '../../utils/db'
import type { Favorite } from '../../types'

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'id') || '0')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID du favori invalide'
    })
  }

  const favorites = await readJsonFile<Favorite[]>('favorites.json')
  const favoriteIndex = favorites.findIndex(f => f.id === id)

  if (favoriteIndex === -1) {
    throw createError({
      statusCode: 404,
      message: 'Favori non trouvé'
    })
  }

  favorites.splice(favoriteIndex, 1)
  await writeJsonFile('favorites.json', favorites)

  return { success: true }
})
