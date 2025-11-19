import { readJsonFile } from '../../utils/db'
import type { Movie } from '../../types'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = (query.search as string)?.toLowerCase() || ''
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 10
  const genre = query.genre as string

  const movies = await readJsonFile<Movie[]>('movies.json')

  let filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(search) || 
                         movie.director.toLowerCase().includes(search)
    const matchesGenre = !genre || movie.genre.includes(genre)
    return matchesSearch && matchesGenre
  })

  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedMovies = filteredMovies.slice(startIndex, endIndex)

  return {
    movies: paginatedMovies,
    pagination: {
      page,
      limit,
      total: filteredMovies.length,
      totalPages: Math.ceil(filteredMovies.length / limit)
    }
  }
})
