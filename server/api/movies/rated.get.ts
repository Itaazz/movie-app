import { readJsonFile } from '../../utils/db'
import type { Movie } from '../../types'

export default defineEventHandler(async () => {
  const movies = await readJsonFile<Movie[]>('movies.json')
  const rated = movies.filter(m => typeof m.notesUser !== 'undefined' && m.notesUser !== null)
  return { movies: rated }
})
