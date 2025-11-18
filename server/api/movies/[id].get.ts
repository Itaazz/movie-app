import { readJsonFile } from '../../utils/db'
import type { Movie } from '../../types'

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'id') || '0')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID du film invalide'
    })
  }

  const movies = await readJsonFile<Movie[]>('movies.json')
  const movie = movies.find(m => m.id === id)

  if (!movie) {
    throw createError({
      statusCode: 404,
      message: 'Film non trouvé'
    })
  }

  return movie
})
