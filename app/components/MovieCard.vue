<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  movie: { type: Object, required: true },
  to: { type: String, required: true },
  ariaLabel: { type: String, default: '' }
})

const label = computed(() => props.ariaLabel || `Voir ${props.movie?.title || 'le film'}`)
</script>

<template>
  <NuxtLink
    :to="to"
    :aria-label="label"
    class="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 h-96 block focus:outline-none focus:ring-2 focus:ring-accent"
  >
    <img
      :src="movie.poster"
      :alt="movie.title"
      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
    />

    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

    <div class="absolute inset-0 flex flex-col justify-end p-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
      <h3 class="text-white font-bold text-lg mb-1 line-clamp-2">{{ movie.title }}</h3>
      <p class="text-gray-300 text-sm mb-3">
        {{ movie.year }}<span v-if="movie.director"> • {{ movie.director }}</span>
      </p>

      <div class="flex items-center space-x-2 mb-4">
        <div class="flex items-center">
          <span class="text-yellow-400">★</span>
          <span class="text-white font-semibold ml-1">{{ movie.rating ?? '—' }}/10</span>
        </div>
      </div>

      <div class="flex flex-wrap gap-2">
        <span
          v-for="g in (movie.genre || []).slice(0, 2)"
          :key="g"
          class="text-xs bg-red-600/80 text-white rounded px-2 py-1"
        >
          {{ g }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

