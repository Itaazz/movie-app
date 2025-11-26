<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { getMovie, searchMovies } = useMovies()
import CommentsSection from '../../components/CommentsSection.vue'
import StarRating from '../../components/StarRating.vue'
const { user } = useAuth()

const movieId = parseInt(route.params.id as string)

const { data: movie, error: movieError } = await useAsyncData(
  `movie-${movieId}`,
  () => getMovie(movieId)
)

// Fetch similar movies (same genre)
const { data: similarMoviesData } = await useAsyncData(
  `similar-${movieId}`,
  async () => {
    if (!movie.value?.genre?.[0]) return { movies: [] }
    return searchMovies({ genre: movie.value.genre[0], limit: 8 })
  }
)

const similarMovies = computed(() => 
  (similarMoviesData.value?.movies || []).filter((m: any) => m.id !== movieId)
)

import { ref } from 'vue'

const userRating = ref<number | null>(movie.value?.notesUser ?? null)

const toast = ref<string | null>(null)

function showToast (msg: string, ms = 2500) {
  toast.value = msg
  setTimeout(() => { toast.value = null }, ms)
}

async function setRating (value: number) {
  try {
    const res = await $fetch(`/api/movies/${movieId}`, {
      method: 'PUT',
      body: { notesUser: value }
    })
    if (res && res.movie) {
      movie.value = res.movie
      userRating.value = res.movie.notesUser ?? null
      showToast('Ta note a bien été enregistrée ✅')
    }
  } catch (err) {
    console.error('Erreur lors de l\'envoi de la note :', err)
    alert('Impossible d\'enregistrer votre note pour le moment.')
  }
}
</script>

<template>
  <div class="min-h-screen">
    <transition name="fade">
      <div v-if="toast" class="fixed right-6 bottom-6 z-50 bg-black/85 text-white px-4 py-2 rounded shadow-md">{{ toast }}</div>
    </transition>

    <div v-if="movieError" class="container mx-auto px-4 py-8 text-destructive">
      <p>Film non trouvé</p>
    </div>

    <div v-else-if="movie" class="pb-12">
      <!-- Hero Section with Poster and Info -->
      <div class="container mx-auto px-4 py-8">
        <div class="flex flex-col md:flex-row gap-8 items-start">
          <!-- Left: Poster -->
          <div class="w-full md:w-auto flex-shrink-0">
            <img 
              :src="movie.poster" 
              :alt="movie.title"
              class="w-full md:w-[320px] rounded-sm shadow-2xl"
            />
          </div>
          
          <!-- Right: Movie Info -->
          <div class="flex-1 relative">
            <!-- Rating Stars (top right) -->
            <div class="absolute top-0 right-0 flex flex-col items-end gap-2">
              <h3 class="text-2xl font-bold text-white mb-2">Notes</h3>
              <StarRating v-model:modelValue="userRating" @rated="setRating" />
            </div>

            <!-- Title -->
            <h1 class="text-6xl font-bold text-white mb-4 pr-32" style="letter-spacing: 0.02em;">
              {{ movie.title }}
            </h1>
            
            <!-- Release Date / Duration / Genres -->
            <div class="text-sm mb-6">
              <span class="text-yellow-400 underline decoration-yellow-400">{{ movie.year }}</span>
              <span class="text-white/60 mx-2">/</span>
              <span class="text-white/80">2h 30min</span>
              <span class="text-white/60 mx-2">/</span>
              <span class="text-white/80">{{ movie.genre?.join(', ') || 'Action, Science fiction' }}</span>
            </div>

            <!-- Director & Cast -->
            <div class="space-y-2 mb-8 text-sm">
              <div>
                <span class="text-white/60">De</span>
                <span class="text-yellow-400 ml-2 underline decoration-yellow-400">{{ movie.director }}</span>
              </div>
              <div>
                <span class="text-white/60">Avec</span>
                <span class="text-yellow-400 ml-2" v-for="(actor, idx) in movie.actors?.slice(0, 3)" :key="actor.name">
                  <span class="underline decoration-yellow-400">{{ actor.name }}</span><span v-if="idx < 2" class="text-white/60">, </span>
                </span>
              </div>
            </div>

            <!-- Synopsis Section -->
            <div class="mt-8">
              <h2 class="text-3xl font-bold text-white mb-4">Synopsis</h2>
              <p class="text-white/80 leading-relaxed text-base max-w-3xl">
                {{ movie.synopsis }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Casting Section -->
      <div class="container mx-auto px-4 mt-16">
        <h2 class="text-3xl font-bold text-white mb-6">
          Le Casting <span class="text-yellow-400">. {{ movie.actors?.length || 0 }}</span>
        </h2>
        <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          <div 
            v-for="actor in movie.actors" 
            :key="actor.name"
            class="flex-shrink-0 w-48"
          >
            <img 
              :src="actor.image || '/placeholder-actor.jpg'" 
              :alt="actor.name"
              class="w-full h-64 object-cover rounded-sm mb-3"
            />
            <h3 class="text-white font-semibold text-sm">{{ actor.name }}</h3>
            <p class="text-yellow-400 text-xs">{{ (actor as any).role || 'Acteur' }}</p>
          </div>
        </div>
      </div>

      <!-- Similar Movies Section -->
      <div class="container mx-auto px-4 mt-16" v-if="similarMovies.length > 0">
        <h2 class="text-3xl font-bold text-white mb-6">Films similaires</h2>
        <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          <NuxtLink 
            v-for="similar in similarMovies" 
            :key="similar.id"
            :to="`/movies/${similar.id}`"
            class="flex-shrink-0 w-48 group"
          >
            <img 
              :src="similar.poster" 
              :alt="similar.title"
              class="w-full h-72 object-cover rounded-sm mb-3 group-hover:opacity-80 transition-opacity"
            />
            <h3 class="text-white font-semibold text-sm">{{ similar.title }}</h3>
          </NuxtLink>
        </div>
      </div>

      <!-- Comments Section -->
      <div class="container mx-auto px-4 mt-16">
        <h2 class="text-3xl font-bold text-white mb-6">Commentaires</h2>
        <CommentsSection :movieId="movieId" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
