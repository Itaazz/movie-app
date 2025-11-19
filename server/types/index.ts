export interface Movie {
  id: number
  title: string
  year: number
  director: string
  poster: string
  synopsis: string
  actors: Array<{ name: string; image: string }>
  rating: number
  genre: string[]
  seen?: boolean
  notesUser?: number | null
}

export interface User {
  id: number
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  avatar: string
  createdAt: string
}

export interface Favorite {
  id: number
  userId: number
  movieId: number
  createdAt: string
}

export interface Comment {
  id: number
  movieId: number
  userId: number
  username: string
  comment: string
  rating: number
  createdAt: string
}

export interface UserPublic {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  avatar: string
  createdAt: string
}

export interface AuthResponse {
  user: UserPublic
  token: string
}
