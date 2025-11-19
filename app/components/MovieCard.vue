<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useFavorites } from '~/composables/useFavorites'

const props = defineProps({
  movie: { type: Object, required: true },
  to: { type: String, required: true },
  ariaLabel: { type: String, default: '' }
})

const label = computed(() => props.ariaLabel || `Voir ${props.movie?.title || 'le film'}`)

const { user, isAuthenticated } = useAuth()
const { getFavorites, addFavorite, removeFavorite } = useFavorites()

const isFav = ref(false)
const processingFav = ref(false)

async function refreshFavState() {
  if (!isAuthenticated.value || !user.value) {
    isFav.value = false
    return
  }

  try {
    const favs = await getFavorites(user.value.id)
    isFav.value = favs.some(f => f.movieId === props.movie.id)
  } catch (err) {
    isFav.value = false
  }
}

onMounted(() => {
  refreshFavState()
})

const toggleFavorite = async (e: MouseEvent) => {
  e.stopPropagation()
  e.preventDefault()

  if (!isAuthenticated.value || !user.value) {
    alert('Vous devez être connecté pour gérer les favoris')
    return
  }

  if (processingFav.value) return
  processingFav.value = true

  try {
    if (!isFav.value) {
      await addFavorite(user.value.id, props.movie.id)
      isFav.value = true
        try { window.dispatchEvent(new CustomEvent('favorites-updated', { detail: { movieId: props.movie.id, added: true } })) } catch {}
    } else {
      const favs = await getFavorites(user.value.id)
      const fav = favs.find(f => f.movieId === props.movie.id)
      if (fav) {
        await removeFavorite(fav.id)
      }
      isFav.value = false
        try { window.dispatchEvent(new CustomEvent('favorites-updated', { detail: { movieId: props.movie.id, added: false } })) } catch {}
    }
  } catch (err) {
    console.error('Favorite toggle error', err)
  } finally {
    processingFav.value = false
  }
}
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

    <!-- Heart button (favorites) -->
    <button
      @click.stop.prevent="toggleFavorite"
      :aria-pressed="isFav"
      :title="isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'"
      class="absolute top-3 right-3 z-30 w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-150"
      :class="isFav ? 'bg-red-600 text-white' : 'bg-white/90 text-red-600 border border-white'"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5">
        <path
          v-if="isFav"
          fill="currentColor"
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 3.99 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.09 4.81 13.76 4 15.5 4 18.01 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        />
        <path
          v-else
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"
        />
      </svg>
    </button>

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

