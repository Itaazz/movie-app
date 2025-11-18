<script setup lang="ts">
import { ref } from 'vue'

const { isAuthenticated } = useAuth()
const router = useRouter()
</script>

<template>
  <nav class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center space-x-8">
          <NuxtLink to="/" class="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div class="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
              <span class="text-white text-lg font-bold">🎬</span>
            </div>
            <span class="hidden sm:inline font-bold text-lg">MovieApp</span>
          </NuxtLink>

          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-1">
            <NuxtLink 
              to="/" 
              class="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Accueil
            </NuxtLink>
            
            <NuxtLink 
              to="/#featured" 
              class="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              À l'affiche
            </NuxtLink>
          </div>
        </div>

        <!-- Right side - Account -->
        <div class="flex items-center space-x-4">
          <UserMenu v-if="isAuthenticated" />
          
          <NuxtLink 
            v-else
            to="/auth"
            class="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Mon compte
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>
