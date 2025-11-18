import type { Comment } from '../../server/types'

interface AddCommentData {
  movieId: number
  userId: number
  comment: string
  rating?: number
}

/**
 * Composable pour gérer les commentaires
 */
export const useComments = () => {
  /**
   * Obtenir les commentaires d'un film
   */
  const getComments = async (movieId: number) => {
    return await $fetch<Comment[]>(`/api/comments/${movieId}`)
  }

  /**
   * Ajouter un commentaire
   */
  const addComment = async (data: AddCommentData) => {
    return await $fetch<Comment>('/api/comments', {
      method: 'POST',
      body: data
    })
  }

  return {
    getComments,
    addComment
  }
}
