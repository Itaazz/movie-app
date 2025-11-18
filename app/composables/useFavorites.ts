import type { Favorite } from '../../server/types'

/**
 * Composable pour gérer les favoris
 */
export const useFavorites = () => {
  /**
   * Obtenir les favoris d'un utilisateur
   */
  const getFavorites = async (userId: number) => {
    return await $fetch<Favorite[]>('/api/favorites', {
      query: { userId }
    })
  }

  /**
   * Ajouter un film aux favoris
   */
  const addFavorite = async (userId: number, movieId: number) => {
    return await $fetch<Favorite>('/api/favorites', {
      method: 'POST',
      body: { userId, movieId }
    })
  }

  /**
   * Supprimer un favori
   */
  const removeFavorite = async (favoriteId: number) => {
    return await $fetch('/api/favorites/' + favoriteId, {
      method: 'DELETE'
    })
  }

  /**
   * Vérifier si un film est dans les favoris
   */
  const isFavorite = async (userId: number, movieId: number) => {
    const favorites = await getFavorites(userId)
    return favorites.some(f => f.movieId === movieId)
  }

  return {
    getFavorites,
    addFavorite,
    removeFavorite,
    isFavorite
  }
}
