import { readJsonFile, writeJsonFile } from '../../utils/db'
import type { Movie } from '../../types'

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'id') || '0')
  if (!id) throw createError({ statusCode: 400, message: 'ID du film invalide' })

  const body = await readBody(event) as Partial<Pick<Movie, 'seen' | 'notesUser'>>

  const movies = await readJsonFile<Movie[]>('movies.json')
  const idx = movies.findIndex(m => m.id === id)
  if (idx === -1) throw createError({ statusCode: 404, message: 'Film non trouvé' })

  if (typeof body.seen !== 'undefined') {
    movies[idx].seen = Boolean(body.seen)
  }
  if (typeof body.notesUser !== 'undefined') {
    movies[idx].notesUser = body.notesUser === null ? null : Number(body.notesUser)
    if (movies[idx].notesUser !== null && movies[idx].notesUser !== undefined) movies[idx].seen = true
  }

  await writeJsonFile('movies.json', movies)

  return { ok: true, movie: movies[idx] }
})
