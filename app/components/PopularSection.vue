<script setup lang="ts">
import { computed } from 'vue'
import MovieCard from './MovieCard.vue'
import Carousel from './Carousel.vue'

const props = defineProps({
  movies: { type: Array as () => any[], default: () => [] }
})

const list = computed(() => props.movies || [])
</script>

<template>
  <section class="py-12 px-4 sm:px-6 lg:px-8">
    <div class="container mx-auto">
      <div class="mb-8 flex items-center justify-between">
        <h2 class="text-3xl font-bold">Films populaires</h2>
      </div>

      <div v-if="list.length">
        <Carousel :items="list">
          <template #default="{ item }">
            <MovieCard :movie="item" :to="`/movies/${item.id}`" />
          </template>
        </Carousel>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-muted-foreground">Aucun film populaire pour le moment</p>
      </div>
    </div>
  </section>
</template>
