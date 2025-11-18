<script setup lang="ts">
import MovieCard from '../components/MovieCard.vue'

const route = useRoute()
const q = (route.query.q as string) || ''

const { searchMovies } = useMovies()
const { data: results, pending, error } = await useAsyncData(() => searchMovies({ search: q, page: 1, limit: 24 }))
</script>

<template>
  <section class="container mx-auto py-8">
    <h1 class="text-2xl font-bold mb-4">Résultats pour "{{ route.query.q || '' }}"</h1>

    <div v-if="pending" class="py-8 text-center">Chargement...</div>
    <div v-else-if="error" class="text-destructive">Erreur lors de la recherche</div>

    <div v-else-if="results && results.movies.length">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <MovieCard
          v-for="m in results.movies"
          :key="m.id"
          :movie="m"
          :to="`/movies/${m.id}`"
        />
      </div>
    </div>

    <div v-else class="py-8 text-center">Aucun résultat</div>
  </section>
</template>
