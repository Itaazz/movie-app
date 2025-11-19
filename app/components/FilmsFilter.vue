<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <label for="sort" class="text-sm text-gray-700">Trier :</label>
        <select id="sort" v-model="sortKey" class="rounded border px-2 py-1 text-sm">
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
      </div>

      <div class="text-sm text-gray-600">{{ sortedMovies.length }} film(s)</div>
    </div>

    <slot :sorted="sortedMovies" :sortKey="sortKey" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps<{ movies?: Array<any> }>()

const route = useRoute()
const router = useRouter()

const sortKey = ref((route.query.sort as string) || 'recent')

const movies = computed(() => (props.movies || []) as any[])

const sortedMovies = computed(() => {
  const list = [...(movies.value || [])]
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
