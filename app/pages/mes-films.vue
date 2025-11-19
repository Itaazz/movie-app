<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-2xl font-bold mb-4">Mes films</h1>

    <FilmsFilter :movies="movies">
      <template #default="{ sorted }">
        <div v-if="isLoading" class="text-center text-gray-500">Chargement…</div>

        <div v-else>
          <div v-if="sorted.length === 0" class="py-12 text-center text-gray-600">
            Vous n'avez pas encore noté de film.
          </div>
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            <MovieCard v-for="m in sorted" :key="m.id" :movie="m" :to="`/movies/${m.id}`" />
          </div>
        </div>
      </template>
    </FilmsFilter>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAsyncData } from '#app'
import MovieCard from '~/components/MovieCard.vue'
import FilmsFilter from '~/components/FilmsFilter.vue'

const { data, pending, error } = await useAsyncData('ratedMovies', () => $fetch('/api/movies/rated'))

const movies = computed(() => (data?.value?.movies ?? []))
const isLoading = computed(() => !!pending.value)

if (error.value) {
  console.warn('Failed to load rated movies', error.value)
}
</script>
 