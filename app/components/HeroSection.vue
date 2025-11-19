<script setup lang="ts">
import { ref } from 'vue'

const isVideoLoaded = ref(false)
</script>

<template>
  <section class="relative w-full overflow-hidden bg-background">
    <div class="relative w-full h-[500px] sm:h-[600px] md:h-[700px] overflow-hidden group">
      <div class="absolute inset-0 bg-gradient-to-r from-background/80 via-background/50 to-transparent"></div>

      <div 
        v-if="!isVideoLoaded"
        class="absolute inset-0 bg-muted animate-pulse"
      ></div>

      <div class="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-20">
        <div class="max-w-2xl">
          
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
            Notez et enregistrez vos films préférés
          </h1>
          
        </div>
      </div>
    </div>
  </section>
</template>
