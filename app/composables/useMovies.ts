import type { Movie } from '../../server/types'

interface MoviesResponse {
  movies: Movie[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface SearchOptions {
  search?: string
  genre?: string
  page?: number
  limit?: number
}

/**
 * Composable pour gérer les films
 */
export const useMovies = () => {
  /**
   * Rechercher et lister les films
   */
  const searchMovies = async (options: SearchOptions = {}) => {
    const { search = '', genre, page = 1, limit = 10 } = options
    
    return await $fetch<MoviesResponse>('/api/movies', {
      query: {
        search,
        genre,
        page,
        limit
      }
    })
  }

  /**
   * Obtenir les détails d'un film
   */
  const getMovie = async (id: number) => {
    return await $fetch<Movie>(`/api/movies/${id}`)
  }

  return {
    searchMovies,
    getMovie
  }
}
