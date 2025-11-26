<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  movieId: { type: Number, required: true }
})

const { getComments, addComment } = useComments()
const { user } = useAuth()

const { data: comments, refresh: refreshComments } = await useAsyncData(
  () => `comments-${props.movieId}`,
  () => getComments(props.movieId)
)

const newComment = ref('')
const newRating = ref(5)
const isSubmitting = ref(false)

const submitComment = async () => {
  if (!user.value || !newComment.value.trim()) return
  isSubmitting.value = true
  try {
    await addComment({
      movieId: props.movieId,
      userId: user.value.id,
      comment: newComment.value,
      rating: newRating.value
    })
    newComment.value = ''
    newRating.value = 5
    await refreshComments()
  } catch (err) {
    console.error(err)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="mt-12">
    <!-- Form to add comment -->
    <div v-if="user" class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 mb-8">
      <h3 class="text-yellow-400 font-semibold text-lg mb-4">Ajouter un commentaire</h3>
      
      <textarea 
        v-model="newComment" 
        placeholder="Écrivez votre avis sur ce film..."
        class="w-full p-4 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400/50 mb-4 resize-none"
        rows="4"
      ></textarea>
      
      <button 
        @click="submitComment" 
        :disabled="isSubmitting || !newComment.trim()" 
        class="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isSubmitting ? 'Envoi en cours...' : 'Publier le commentaire' }}
      </button>
    </div>

    <p v-else class="text-white/60 mb-8 text-center py-8 bg-white/5 rounded-lg border border-white/10">
      Connectez-vous pour laisser un commentaire
    </p>

    <!-- Comments Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        v-for="comment in comments" 
        :key="comment.id" 
        class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-colors"
      >
        <!-- Comment Header -->
        <div class="mb-4">
          <h4 class="text-yellow-400 font-semibold text-lg mb-1">
            {{ comment.username || 'Utilisateur' }}
          </h4>
          <span class="text-white/60 text-sm">{{ new Date(comment.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) }}</span>
        </div>
        
        <!-- Comment Body -->
        <p class="text-white/80 leading-relaxed">
          {{ comment.comment }}
        </p>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="!comments || comments.length === 0" class="text-center py-12">
      <p class="text-white/60 text-lg">Aucun commentaire pour le moment. Soyez le premier à donner votre avis !</p>
    </div>
  </div>
</template>


