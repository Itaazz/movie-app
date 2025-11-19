<script setup lang="ts">
const props = defineProps<{ actor: { name: string; image: string } }>()
</script>

<template>
  <div class="flex flex-col items-center text-center p-3 bg-surface/60 rounded-lg shadow-sm">
    <img :src="props.actor.image" :alt="props.actor.name" class="w-20 h-20 rounded-full object-cover mb-2" />
    <div class="text-sm font-medium text-foreground">{{ props.actor.name }}</div>
  </div>
</template>
