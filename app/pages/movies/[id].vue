<script setup lang="ts">
const route = useRoute()
const { getMovie } = useMovies()
const { getComments, addComment } = useComments()
const { user } = useAuth()
const { addFavorite } = useFavorites()

const movieId = parseInt(route.params.id as string)

// Charger le film
const { data: movie, error: movieError } = await useAsyncData(
  `movie-${movieId}`,
  () => getMovie(movieId)
)

// Charger les commentaires
const { data: comments, refresh: refreshComments } = await useAsyncData(
  `comments-${movieId}`,
  () => getComments(movieId)
)

// État du formulaire de commentaire
const newComment = ref('')
const newRating = ref(5)
const isSubmitting = ref(false)

// Soumettre un commentaire
const submitComment = async () => {
  if (!user.value || !newComment.value.trim()) return

  isSubmitting.value = true
  try {
    await addComment({
      movieId,
      userId: user.value.id,
      comment: newComment.value,
      rating: newRating.value
    })
    
    newComment.value = ''
    newRating.value = 5
    await refreshComments()
  } catch (error) {
    console.error('Erreur lors de l\'ajout du commentaire:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Ajouter aux favoris
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
</script>

<template>
  <div class="container mx-auto p-6">
    <NuxtLink to="/" class="text-primary hover:underline mb-4 inline-block">
      ← Retour à la liste
    </NuxtLink>

    <div v-if="movieError" class="text-destructive">
      <p>Film non trouvé</p>
    </div>

    <div v-else-if="movie" class="space-y-8">
      <!-- En-tête du film -->
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
            <ul class="list-disc list-inside">
              <li v-for="actor in movie.actors" :key="actor">{{ actor }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Section commentaires -->
      <div class="border-t pt-8">
        <h2 class="text-2xl font-bold mb-6">
          Commentaires ({{ comments?.length || 0 }})
        </h2>

        <!-- Formulaire d'ajout de commentaire -->
        <div v-if="user" class="bg-muted p-4 rounded-lg mb-6">
          <h3 class="font-semibold mb-3">Ajouter un commentaire</h3>
          <div class="mb-3">
            <label class="block mb-2">Note : {{ newRating }}/10</label>
            <input 
              v-model.number="newRating"
              type="range" 
              min="0" 
              max="10" 
              class="w-full"
            />
          </div>
          <textarea 
            v-model="newComment"
            placeholder="Votre commentaire..."
            class="w-full p-2 border border-input rounded mb-3"
            rows="4"
          ></textarea>
          <button 
            @click="submitComment"
            :disabled="isSubmitting || !newComment.trim()"
            class="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
          >
            {{ isSubmitting ? 'Envoi...' : 'Publier' }}
          </button>
        </div>

        <p v-else class="text-muted-foreground mb-6">
          Connectez-vous pour laisser un commentaire
        </p>

        <!-- Liste des commentaires -->
        <div class="space-y-4">
          <div 
            v-for="comment in comments" 
            :key="comment.id"
            class="bg-card p-4 rounded-lg shadow"
          >
            <div class="flex justify-between items-start mb-2">
              <div>
                <span class="font-semibold">{{ comment.username }}</span>
                <span class="text-sm text-muted-foreground ml-2">
                  {{ new Date(comment.createdAt).toLocaleDateString('fr-FR') }}
                </span>
              </div>
              <div class="flex items-center">
                <span class="text-accent">★</span>
                <span class="ml-1 font-medium">{{ comment.rating }}/10</span>
              </div>
            </div>
            <p class="text-foreground">{{ comment.comment }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
