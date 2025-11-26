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

watch([search, genre], () => {
  refresh()
})

const movies = computed(() => ((data.value as any)?.movies ?? []))

const availableGenres = computed<string[]>(() => {
  const set = new Set<string>()
  for (const m of movies.value) {
    if (!m) continue
    const g = (m as any).genres || (m as any).genre
    if (Array.isArray(g)) {
      g.forEach((x: unknown) => {
        if (x != null && String(x).trim() !== '') set.add(String(x).trim())
      })
    } else if (g != null && String(g).trim() !== '') {
      set.add(String(g).trim())
    }
  }
  return Array.from(set).sort((a,b) => a.localeCompare(b))
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

// Pagination controls removed — no page navigation on the films listing.
</script>

<template>
  <section class="container mx-auto py-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div class="flex-1">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <input
            v-model="search"
            type="search"
            placeholder="Rechercher des films..."
            aria-label="Rechercher des films"
            class="w-full rounded-md bg-transparent text-white placeholder-white/60 px-12 h-10 border border-white/30 shadow-sm focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>
      </div>

      <div class="flex items-center gap-3">
  <select v-model="genre" class="rounded-md px-3 h-10 border border-white/30 bg-transparent text-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-white/20">
          <option value="" class="text-white">Tous genres</option>
          <option v-for="g in availableGenres" :key="g" :value="g" class="text-white">{{ g }}</option>
        </select>

  <select v-model="sort" class="rounded-md px-3 h-10 border border-white/30 bg-transparent text-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-white/20">
          <option value="best" class="text-white">Meilleures notes</option>
          <option value="alpha" class="text-white">Ordre alphabétique</option>
          <option value="year" class="text-white">Année (récent)</option>
        </select>

  <select v-model="sortDir" class="rounded-md px-3 h-10 border border-white/30 bg-transparent text-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-white/20">
          <option value="desc" class="text-white">Descendant</option>
          <option value="asc" class="text-white">Ascendant</option>
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
    </div>
  </section>
</template>
