<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import MovieCard from '../components/MovieCard.vue'

const search = ref('')
const genre = ref('')
const sort = ref('best') 
const sortDir = ref<'asc' | 'desc'>('desc')
const page = ref(1)
const limit = ref(12)

const { searchMovies } = useMovies()

const { data, pending, error, refresh } = await useAsyncData<any>(() => searchMovies({ search: search.value, genre: genre.value, page: page.value, limit: limit.value }))

// Refresh when search/genre/page changes
watch([search, genre, page], () => {
  // reset to first page when search or genre changes
  if (page.value !== 1 && (search.value || genre.value)) page.value = 1
  refresh()
})

const movies = computed(() => ((data.value as any)?.movies ?? []))

const availableGenres = computed<string[]>(() => {
  const arr: string[] = [];
  ((data.value as any)?.movies || []).forEach((m: any) => {
    if (Array.isArray(m.genre)) m.genre.forEach((g: string) => arr.push(g))
  })
  return Array.from(new Set(arr))
})

const sorted = computed(() => {
  const list = [...movies.value]
  if (sort.value === 'best') {
    return list.sort((a,b) => ((b.rating||0) - (a.rating||0)) * (sortDir.value === 'desc' ? 1 : -1))
  }
  if (sort.value === 'alpha') {
    return list.sort((a,b) => (a.title||'').localeCompare(b.title||'') * (sortDir.value === 'desc' ? 1 : -1))
  }
  if (sort.value === 'year') {
    return list.sort((a,b) => ((b.year||0) - (a.year||0)) * (sortDir.value === 'desc' ? 1 : -1))
  }
  return list
})

function goToPage(n: number) {
  if (!(data.value as any)?.pagination) return
  const total = (data.value as any).pagination.totalPages || 1
  page.value = Math.max(1, Math.min(n, total))
}
</script>

<template>
  <section class="container mx-auto py-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div class="flex-1">
        <input v-model="search" type="search" placeholder="Rechercher des films..." class="w-full rounded-md px-4 py-2 border" />
      </div>

      <div class="flex items-center gap-3">
        <select v-model="genre" class="rounded-md px-3 py-2 border bg-white">
          <option value="">Tous genres</option>
          <option v-for="g in availableGenres" :key="g" :value="g">{{ g }}</option>
        </select>

        <select v-model="sort" class="rounded-md px-3 py-2 border bg-white">
          <option value="best">Meilleures notes</option>
          <option value="alpha">Ordre alphabétique</option>
          <option value="year">Année (récent)</option>
        </select>
        
        <select v-model="sortDir" class="rounded-md px-3 py-2 border bg-white">
          <option value="desc">Descendant</option>
          <option value="asc">Ascendant</option>
        </select>
      </div>
    </div>

    <div v-if="pending" class="py-12 text-center">Chargement des films...</div>
    <div v-else-if="error" class="text-destructive">Erreur lors du chargement des films</div>

    <div v-else>
      <div v-if="sorted.length === 0" class="py-12 text-center">Aucun film trouvé.</div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <MovieCard
          v-for="m in sorted"
          :key="m.id"
          :movie="m"
          :to="`/movies/${m.id}`"
        />
      </div>

      <div v-if="data && data.pagination" class="mt-8 flex items-center justify-center gap-3">
        <button class="px-3 py-1 border rounded" :disabled="data.pagination.page <= 1" @click="goToPage(data.pagination.page - 1)">Préc.</button>
        <span class="px-3 py-1">Page {{ data.pagination.page }} / {{ data.pagination.totalPages }}</span>
        <button class="px-3 py-1 border rounded" :disabled="data.pagination.page >= data.pagination.totalPages" @click="goToPage(data.pagination.page + 1)">Suiv.</button>
      </div>
    </div>
  </section>
</template>
