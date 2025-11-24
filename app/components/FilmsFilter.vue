<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <label for="sort" class="text-sm text-white">Trier :</label>
        <select id="sort" v-model="sortKey" class="rounded-md px-3 h-10 border border-white/30 bg-transparent text-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-white/20">
          <option value="recent">Récemment ajoutés</option>
          <option value="oldest">Les plus anciens</option>
          <option value="year_desc">Année (décroissant)</option>
          <option value="year_asc">Année (croissant)</option>
          <option value="alpha">Ordre alphabétique</option>
          <option value="best_imdb">Meilleures notes (IMDb)</option>
          <option value="worst_imdb">Pires notes (IMDb)</option>
          <option value="best_user">Meilleures notes (Mes notes)</option>
          <option value="worst_user">Pires notes (Mes notes)</option>
        </select>

        <label class="flex items-center gap-2 text-sm ml-3">
          <input type="checkbox" v-model="onlyFavorites" :disabled="!isAuthenticated" class="w-4 h-4" />
          <span class="text-white">Favoris</span>
        </label>
      </div>

      <div class="text-sm text-white">{{ sortedMovies.length }} film(s)</div>
    </div>

    <slot :sorted="sortedMovies" :sortKey="sortKey" :onlyFavorites="onlyFavorites" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useFavorites } from '~/composables/useFavorites'

const props = defineProps<{ movies?: Array<any> }>()

const route = useRoute()
const router = useRouter()
const { user, isAuthenticated } = useAuth()
const { getFavorites } = useFavorites()

const sortKey = ref((route.query.sort as string) || 'recent')
const onlyFavorites = ref(false)

const movies = computed(() => (props.movies || []) as any[])

const favoriteIds = ref<number[]>([])

async function loadFavorites() {
  if (!isAuthenticated.value || !user.value) {
    favoriteIds.value = []
    return
  }
  try {
    const favs = await getFavorites(user.value.id)
    favoriteIds.value = favs.map(f => f.movieId)
  } catch (err) {
    favoriteIds.value = []
  }
}

watch(() => user.value?.id, () => loadFavorites(), { immediate: true })

onMounted(() => {
  const onFavUpdated = (e: any) => {
    try {
      const detail = e.detail || {}
      const { movieId, added } = detail
      if (typeof movieId === 'undefined') return
      if (added) {
        if (!favoriteIds.value.includes(movieId)) favoriteIds.value.push(movieId)
      } else {
        favoriteIds.value = favoriteIds.value.filter(id => id !== movieId)
      }
    } catch (err) { }
  }
  window.addEventListener('favorites-updated', onFavUpdated)
  onBeforeUnmount(() => window.removeEventListener('favorites-updated', onFavUpdated))
})

const sortedMovies = computed(() => {
  let list = [...(movies.value || [])]

  if (onlyFavorites.value) {
    list = list.filter(m => favoriteIds.value.includes(m.id))
  }

  switch (sortKey.value) {
    case 'year_asc':
      return list.sort((a, b) => (a.year || 0) - (b.year || 0))
    case 'year_desc':
      return list.sort((a, b) => (b.year || 0) - (a.year || 0))
    case 'alpha':
      return list.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    case 'best_imdb':
      return list.sort((a, b) => (b.rating ?? -Infinity) - (a.rating ?? -Infinity))
    case 'worst_imdb':
      return list.sort((a, b) => (a.rating ?? Infinity) - (b.rating ?? Infinity))
    case 'best_user':
      return list.sort((a, b) => (b.notesUser ?? -Infinity) - (a.notesUser ?? -Infinity))
    case 'worst_user':
      return list.sort((a, b) => (a.notesUser ?? Infinity) - (b.notesUser ?? Infinity))
    case 'recent':
      return list.sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
    case 'oldest':
      return list.sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
    default:
      return list
  }
})

watch(sortKey, (v) => {
  const current = route.query.sort as string | undefined
  if (current !== v) {
    router.replace({ query: { ...route.query, sort: v } }).catch(() => {})
  }
})

watch(() => route.query.sort, (v) => {
  const s = v as string | undefined
  if (s && s !== sortKey.value) sortKey.value = s
})
</script>
