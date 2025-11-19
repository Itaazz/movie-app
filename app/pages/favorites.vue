<script setup lang="ts">
const { user, isAuthenticated } = useAuth()
const { getFavorites, removeFavorite } = useFavorites()
const { getMovie } = useMovies()
const router = useRouter()

if (!isAuthenticated.value) {
  router.push('/auth')
}

const { data: favorites, refresh: refreshFavorites } = await useAsyncData(
  'my-favorites',
  async () => {
    if (!user.value) return []
    return await getFavorites(user.value.id)
  }
)

const { data: favoritesWithMovies } = await useAsyncData(
  'favorites-movies',
  async () => {
    if (!favorites.value) return []
    
    const movies = await Promise.all(
      favorites.value.map(async (fav) => {
        const movie = await getMovie(fav.movieId)
        return { ...fav, movie }
      })
    )
    return movies
  },
  { watch: [favorites] }
)

// Supprimer un favori
const handleRemove = async (favoriteId: number) => {
  if (!confirm('Voulez-vous vraiment supprimer ce film de vos favoris ?')) {
    return
  }

  try {
    await removeFavorite(favoriteId)
    await refreshFavorites()
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  }
}
</script>

<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Mes favoris</h1>

    <div v-if="!favoritesWithMovies || favoritesWithMovies.length === 0" class="text-center py-10">
      <p class="text-muted-foreground text-lg mb-4">Vous n'avez pas encore de films favoris</p>
      <NuxtLink to="/" class="text-primary hover:underline">
        Découvrir des films
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div 
        v-for="favorite in favoritesWithMovies" 
        :key="favorite.id"
        class="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative"
      >
        <button
          @click="handleRemove(favorite.id)"
          class="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full w-8 h-8 flex items-center justify-center hover:bg-destructive/80 z-10"
          title="Supprimer des favoris"
        >
          ✕
        </button>

        <NuxtLink :to="`/movies/${favorite.movie.id}`">
          <img 
            :src="favorite.movie.poster" 
            :alt="favorite.movie.title"
            class="w-full h-64 object-cover"
          />
          <div class="p-4">
            <h2 class="text-xl font-semibold mb-2">{{ favorite.movie.title }}</h2>
            <p class="text-gray-600 text-sm mb-2">
              {{ favorite.movie.year }} • {{ favorite.movie.director }}
            </p>
            <div class="flex items-center mb-2">
              <span class="text-yellow-500">★</span>
              <span class="ml-1 text-sm font-medium">{{ favorite.movie.rating }}/10</span>
            </div>
            <div class="flex flex-wrap gap-1">
              <span 
                v-for="genre in favorite.movie.genre" 
                :key="genre"
                class="text-xs bg-gray-200 rounded px-2 py-1"
              >
                {{ genre }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
