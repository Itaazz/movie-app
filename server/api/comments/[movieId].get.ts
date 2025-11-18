import { readJsonFile } from '../../utils/db'
import type { Comment } from '../../types'

export default defineEventHandler(async (event) => {
  const movieId = parseInt(getRouterParam(event, 'movieId') || '0')

  if (!movieId) {
    throw createError({
      statusCode: 400,
      message: 'ID du film invalide'
    })
  }

  const comments = await readJsonFile<Comment[]>('comments.json')
  const movieComments = comments.filter(c => c.movieId === movieId)

  // Trier par date décroissante (plus récent en premier)
  movieComments.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return movieComments
})
