<script setup lang="ts">
const { searchMovies } = useMovies()

// Rechercher les films au chargement
const { data: moviesData, pending, error } = await useAsyncData(
  'movies',
  () => searchMovies({ page: 1, limit: 10 })
)
</script>

<template>
  <div>
    <!-- Hero Section -->
    <HeroSection />

    <!-- Featured Section "À l'affiche" -->
    <FeaturedSection />

    <!-- Films Section -->
    <section class="py-12 px-4 sm:px-6 lg:px-8">
      <div class="container mx-auto">
        <h2 class="text-3xl font-bold mb-8">Films populaires</h2>

        <div v-if="pending" class="text-center py-10">
          <p>Chargement des films...</p>
        </div>

        <div v-else-if="error" class="text-destructive">
          <p>Erreur lors du chargement des films</p>
        </div>

        <div v-else-if="moviesData">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <NuxtLink
              v-for="movie in moviesData.movies" 
              :key="movie.id"
              :to="`/movies/${movie.id}`"
              class="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div class="relative overflow-hidden h-64">
                <img 
                  :src="movie.poster" 
                  :alt="movie.title"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-2 line-clamp-2 text-card-foreground">{{ movie.title }}</h3>
                <p class="text-muted-foreground text-sm mb-2">{{ movie.year }} • {{ movie.director }}</p>
                <div class="flex items-center mb-2">
                  <span class="text-accent">★</span>
                  <span class="ml-1 text-sm font-medium text-card-foreground">{{ movie.rating }}/10</span>
                </div>
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="genre in movie.genre" 
                    :key="genre"
                    class="text-xs bg-muted text-muted-foreground rounded px-2 py-1"
                  >
                    {{ genre }}
                  </span>
                </div>
              </div>
            </NuxtLink>
          </div>

          <div v-if="moviesData.pagination" class="mt-8 text-center">
            <p class="text-muted-foreground">
              Page {{ moviesData.pagination.page }} sur {{ moviesData.pagination.totalPages }}
              ({{ moviesData.pagination.total }} films au total)
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
