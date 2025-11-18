import type { User, UserPublic, AuthResponse } from '../../server/types'

interface RegisterData {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
}

interface LoginData {
  email: string
  password: string
}

/**
 * Composable pour gérer l'authentification et les utilisateurs
 */
export const useAuth = () => {
  const user = useState<UserPublic | null>('user', () => null)
  const token = useState<string | null>('token', () => null)

  /**
   * S'inscrire
   */
  const register = async (data: RegisterData) => {
    const response = await $fetch<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: data
    })

    user.value = response.user
    token.value = response.token

    return response
  }

  /**
   * Se connecter
   */
  const login = async (data: LoginData) => {
    const response = await $fetch<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: data
    })

    user.value = response.user
    token.value = response.token

    return response
  }

  /**
   * Se déconnecter
   */
  const logout = () => {
    user.value = null
    token.value = null
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  const isAuthenticated = computed(() => !!user.value)

  /**
   * Obtenir un utilisateur par son ID
   */
  const getUser = async (id: number) => {
    return await $fetch<UserPublic>(`/api/users/${id}`)
  }

  return {
    user,
    token,
    register,
    login,
    logout,
    isAuthenticated,
    getUser
  }
}
