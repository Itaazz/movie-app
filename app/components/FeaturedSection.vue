<script setup lang="ts">
import { ref } from 'vue'
import MovieCard from './MovieCard.vue'

const activeFilter = ref<'all' | 'action' | 'drama' | 'scifi'>('all')

const filters = [
  { id: 'all', label: 'Tous', genre: undefined },
  { id: 'action', label: 'Action', genre: 'Action' },
  { id: 'drama', label: 'Drame', genre: 'Drame' },
  { id: 'scifi', label: 'Science-Fiction', genre: 'Science-Fiction' },
]

const { searchMovies } = useMovies()

const { data: moviesData, refresh } = await useAsyncData(
  () => `movies-${activeFilter.value}`,
  async () => {
    const genre = filters.find(f => f.id === activeFilter.value)?.genre
    return await searchMovies({ 
      genre: genre,
      page: 1, 
      limit: 12 
    })
  },
  { watch: [activeFilter] }
)

const handleFilterChange = (filterId: string) => {
  activeFilter.value = filterId as 'all' | 'action' | 'drama' | 'scifi'
}
</script>

<template>
  <section class="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-accent/5">
    <div class="container mx-auto">
      <!-- Header -->
      <div class="mb-12">
        <h2 class="text-4xl font-bold mb-2">À l'affiche</h2>
        <p class="text-muted-foreground text-lg">Découvrez nos films actuellement en avant-première</p>
      </div>

      <!-- Filter Tabs -->
      <div class="flex flex-wrap gap-3 mb-12">
        <button
          v-for="filter in filters"
          :key="filter.id"
          @click="handleFilterChange(filter.id)"
          :class="[
            'px-4 py-2 rounded-full font-medium transition-all duration-200',
            activeFilter === filter.id
              ? 'bg-primary text-primary-foreground shadow-lg'
              : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'
          ]"
        >
          {{ filter.label }}
        </button>
      </div>

      <!-- Movies Grid -->
      <div v-if="moviesData" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <MovieCard
          v-for="movie in moviesData.movies"
          :key="movie.id"
          :movie="movie"
          :to="`/movies/${movie.id}`"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <p class="text-muted-foreground">Aucun film trouvé pour ce filtre</p>
      </div>
    </div>
  </section>
</template>
