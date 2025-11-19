<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { getMovie } = useMovies()
import CommentsSection from '../../components/CommentsSection.vue'
import ActorCard from '../../components/ActorCard.vue'
import StarRating from '../../components/StarRating.vue'
const { user } = useAuth()
const { addFavorite } = useFavorites()

const movieId = parseInt(route.params.id as string)

const { data: movie, error: movieError } = await useAsyncData(
  `movie-${movieId}`,
  () => getMovie(movieId)
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



const handleAddFavorite = async () => {
  if (!user.value) {
    alert('Vous devez être connecté pour ajouter aux favoris')
    return
  }

  try {
    await addFavorite(user.value.id, movieId)
    alert('Film ajouté aux favoris !')
  } catch (error) {
    console.error('Erreur:', error)
  }
}

function handleBack() {
  if (typeof window !== 'undefined' && window.history.length > 1) {
    router.back()
  } else {
    router.push('/films')
  }
}
</script>

<template>
  <div class="container mx-auto p-6">
    <transition name="fade">
      <div v-if="toast" class="fixed right-6 bottom-6 z-50 bg-black/85 text-white px-4 py-2 rounded shadow-md">{{ toast }}</div>
    </transition>
    <button @click="handleBack" class="text-primary hover:underline mb-4 inline-block">
      ← Retour à la liste
    </button>

    <div v-if="movieError" class="text-destructive">
      <p>Film non trouvé</p>
    </div>

    <div v-else-if="movie" class="space-y-8">
      <div class="flex flex-col md:flex-row gap-6">
        <img 
          :src="movie.poster" 
          :alt="movie.title"
          class="w-full md:w-80 h-auto rounded-lg shadow-lg"
        />
        
        <div class="flex-1">
          <h1 class="text-4xl font-bold mb-2">{{ movie.title }}</h1>
          <p class="text-xl text-muted-foreground mb-4">{{ movie.year }}</p>
          
          <div class="flex items-center gap-4 mb-4">
            <div class="flex items-center">
              <span class="text-accent text-2xl">★</span>
              <span class="ml-1 text-xl font-medium">{{ movie.rating }}/10</span>
            </div>
            <div class="ml-4 flex items-center gap-4">
              <div class="text-sm text-muted-foreground">Votre note :</div>
              <StarRating v-model:modelValue="userRating" @rated="setRating" />
            </div>

            <button 
              @click="handleAddFavorite"
              class="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              ⭐ Ajouter aux favoris
            </button>
          </div>

          <div class="mb-4">
            <h2 class="text-lg font-semibold mb-2">Genres</h2>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="genre in movie.genre" 
                :key="genre"
                class="bg-muted rounded px-3 py-1"
              >
                {{ genre }}
              </span>
            </div>
          </div>

          <div class="mb-4">
            <h2 class="text-lg font-semibold mb-2">Réalisateur</h2>
            <p>{{ movie.director }}</p>
          </div>

          <div class="mb-4">
            <h2 class="text-lg font-semibold mb-2">Synopsis</h2>
            <p class="text-foreground leading-relaxed">{{ movie.synopsis }}</p>
          </div>

          <div>
            <h2 class="text-lg font-semibold mb-2">Acteurs</h2>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <ActorCard v-for="actor in movie.actors" :key="actor.name" :actor="actor" />
            </div>
          </div>
        </div>
      </div>

      <CommentsSection :movieId="movieId" />
    </div>
  </div>
</template>
