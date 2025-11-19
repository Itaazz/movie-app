<script setup lang="ts">
import { ref } from 'vue'

const isVideoLoaded = ref(false)
</script>

<template>
  <section class="relative w-full overflow-hidden bg-background">
    <div class="relative w-full h-[500px] sm:h-[600px] md:h-[700px] overflow-hidden group">
      <video
        autoplay
        muted
        loop
        playsinline
        @loadedmetadata="isVideoLoaded = true"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      >
        <source 
          src="https://media.istockphoto.com/id/1486020896/video/cinema-movie-theatre-interior-reel-cinema-background.mp4?s=mp4-640x640-is&sd=true" 
          type="video/mp4"
        />
        <img 
          src="https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=1200&h=700&fit=crop" 
          alt="Cinema" 
          class="w-full h-full object-cover"
        />
      </video>

      <div class="absolute inset-0 bg-gradient-to-r from-background/80 via-background/50 to-transparent"></div>

      <div 
        v-if="!isVideoLoaded"
        class="absolute inset-0 bg-muted animate-pulse"
      ></div>

      <div class="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-20">
        <div class="max-w-2xl">
          <div class="inline-block mb-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
            🎬 DÉCOUVREZ LE CINÉMA
          </div>
          
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
            Les meilleurs films du moment
          </h1>
          
          <p class="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl">
            Explorez notre sélection exclusive de films en avant-première. Trouvez votre prochain film préféré.
          </p>

          <div class="flex flex-col sm:flex-row gap-4">
            <NuxtLink 
              to="/"
              class="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/80 transition-colors duration-200 w-full sm:w-auto"
            >
              Voir les films
              <span class="ml-2">→</span>
            </NuxtLink>
            
            <button 
              class="inline-flex items-center justify-center px-8 py-3 border-2 border-foreground text-foreground font-semibold rounded-lg hover:bg-foreground hover:text-background transition-colors duration-200 w-full sm:w-auto"
            >
              En savoir plus
            </button>
          </div>
        </div>
      </div>

      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-foreground animate-bounce">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </div>
  </section>
</template>
