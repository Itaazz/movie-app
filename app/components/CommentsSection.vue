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
  <div class="border-t pt-8">
    <h2 class="text-2xl font-bold mb-6">
      Commentaires ({{ comments?.length || 0 }})
    </h2>

    <div v-if="user" class="bg-muted p-4 rounded-lg mb-6">
      <h3 class="font-semibold mb-3">Ajouter un commentaire</h3>
      <div class="mb-3">
        <label class="block mb-2">Note : {{ newRating }}/10</label>
        <input v-model.number="newRating" type="range" min="0" max="10" class="w-full" />
      </div>
      <textarea v-model="newComment" placeholder="Votre commentaire..." class="w-full p-2 border border-input rounded mb-3" rows="4"></textarea>
      <button @click="submitComment" :disabled="isSubmitting || !newComment.trim()" class="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50">
        {{ isSubmitting ? 'Envoi...' : 'Publier' }}
      </button>
    </div>

    <p v-else class="text-muted-foreground mb-6">Connectez-vous pour laisser un commentaire</p>

    <div class="space-y-4">
      <div v-for="comment in comments" :key="comment.id" class="bg-card p-4 rounded-lg shadow">
        <div class="flex justify-between items-start mb-2">
          <div>
            <span class="font-semibold">{{ comment.username }}</span>
            <span class="text-sm text-muted-foreground ml-2">{{ new Date(comment.createdAt).toLocaleDateString('fr-FR') }}</span>
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
</template>
