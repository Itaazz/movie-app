<script setup lang="ts">
const { searchMovies } = useMovies()

const { data: moviesData, pending, error } = await useAsyncData(
  'movies',
  () => searchMovies({ page: 1, limit: 10 })
)
</script>

<template>
  <div>
    <HeroSection />

    <FeaturedSection />

  <PopularSection v-if="moviesData" :movies="moviesData.movies" />
  </div>
</template>
