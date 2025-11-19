import { readJsonFile, writeJsonFile, generateId } from '../../utils/db'
import type { Comment, User } from '../../types'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { movieId, userId, comment, rating } = body

  if (!movieId || !userId || !comment) {
    throw createError({
      statusCode: 400,
      message: 'movieId, userId et comment sont requis'
    })
  }

  if (rating && (rating < 0 || rating > 10)) {
    throw createError({
      statusCode: 400,
      message: 'La note doit être entre 0 et 10'
    })
  }

  const users = await readJsonFile<User[]>('users.json')
  const user = users.find(u => u.id === userId)

  if (!user) {
    throw createError({
      statusCode: 404,
      message: 'Utilisateur non trouvé'
    })
  }

  const comments = await readJsonFile<Comment[]>('comments.json')

  const newComment: Comment = {
    id: generateId(comments),
    movieId,
    userId,
    username: user.username,
    comment,
    rating: rating || 0,
    createdAt: new Date().toISOString()
  }

  comments.push(newComment)
  await writeJsonFile('comments.json', comments)

  return newComment
})
