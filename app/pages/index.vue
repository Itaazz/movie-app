<script setup lang="ts">
const { searchMovies } = useMovies()

// Rechercher les films au chargement
const { data: moviesData, pending, error } = await useAsyncData(
  'movies',
  () => searchMovies({ page: 1, limit: 10 })
)
</script>

<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Films populaires</h1>

    <div v-if="pending" class="text-center py-10">
      <p>Chargement des films...</p>
    </div>

    <div v-else-if="error" class="text-red-500">
      <p>Erreur lors du chargement des films</p>
    </div>

    <div v-else-if="moviesData">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <NuxtLink
          v-for="movie in moviesData.movies" 
          :key="movie.id"
          :to="`/movies/${movie.id}`"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        >
          <img 
            :src="movie.poster" 
            :alt="movie.title"
            class="w-full h-64 object-cover"
          />
          <div class="p-4">
            <h2 class="text-xl font-semibold mb-2">{{ movie.title }}</h2>
            <p class="text-gray-600 text-sm mb-2">{{ movie.year }} • {{ movie.director }}</p>
            <div class="flex items-center mb-2">
              <span class="text-yellow-500">★</span>
              <span class="ml-1 text-sm font-medium">{{ movie.rating }}/10</span>
            </div>
            <div class="flex flex-wrap gap-1">
              <span 
                v-for="genre in movie.genre" 
                :key="genre"
                class="text-xs bg-gray-200 rounded px-2 py-1"
              >
                {{ genre }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div v-if="moviesData.pagination" class="mt-8 text-center">
        <p class="text-gray-600">
          Page {{ moviesData.pagination.page }} sur {{ moviesData.pagination.totalPages }}
          ({{ moviesData.pagination.total }} films au total)
        </p>
      </div>
    </div>
  </div>
</template>
