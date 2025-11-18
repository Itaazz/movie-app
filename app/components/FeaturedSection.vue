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

// Simple scroll-snap carousel state


import { ref as vueRef, computed, onMounted, onBeforeUnmount } from 'vue'
const slidesPerView = vueRef(4)
const track = vueRef<HTMLElement | null>(null)

function updateSlidesPerView() {
  const w = window.innerWidth
  if (w < 640) slidesPerView.value = 1
  else if (w < 768) slidesPerView.value = 2
  else if (w < 1024) slidesPerView.value = 3
  else slidesPerView.value = 4
}

onMounted(() => {
  updateSlidesPerView()
  window.addEventListener('resize', updateSlidesPerView)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateSlidesPerView)
})

const moviesList = computed(() => (((moviesData as any)?.value?.movies) || []))

function prev() {
  if (!track.value) return
  track.value.scrollBy({ left: -track.value.clientWidth * 0.9, behavior: 'smooth' })
}

function next() {
  if (!track.value) return
  track.value.scrollBy({ left: track.value.clientWidth * 0.9, behavior: 'smooth' })
}

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

      <div v-if="moviesList.length" class="relative">
        <button
          v-if="moviesList.length > 4"
          @click="prev"
          class="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 ml-2"
          aria-label="Précédent"
        >
          ‹
        </button>

        <div ref="track" class="overflow-x-auto scrollbar-none" style="scroll-behavior: smooth; -webkit-overflow-scrolling: touch;">
          <div class="flex gap-4 items-stretch" style="scroll-snap-type: x mandatory;">
            <div
              v-for="movie in moviesList"
              :key="movie.id"
              class="flex-shrink-0 p-2"
              :style="{ width: `${100 / slidesPerView}%`, scrollSnapAlign: 'start' }"
            >
              <MovieCard :movie="movie" :to="`/movies/${movie.id}`" />
            </div>
          </div>
        </div>

        <!-- Next (only show when more than 4 movies) -->
        <button
          v-if="moviesList.length > 4"
          @click="next"
          class="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 mr-2"
          aria-label="Suivant"
        >
          ›
        </button>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-muted-foreground">Aucun film trouvé pour ce filtre</p>
      </div>
    </div>
  </section>
</template>
