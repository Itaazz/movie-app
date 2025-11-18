<script setup lang="ts">
import { ref } from 'vue'

const { user, logout, isAuthenticated } = useAuth()
const router = useRouter()
const isOpen = ref(false)

const handleLogout = () => {
  logout()
  isOpen.value = false
  router.push('/auth')
}

const handleClickOutside = () => {
  isOpen.value = false
}
</script>

<template>
  <div class="relative">
    <!-- User Button -->
    <button
      @click="isOpen = !isOpen"
      v-if="isAuthenticated"
      class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
    >
      <div class="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
        {{ user?.firstName?.[0] }}{{ user?.lastName?.[0] }}
      </div>
      <div class="hidden sm:block text-sm">
        <div class="font-medium">{{ user?.firstName }}</div>
        <div class="text-xs text-muted-foreground">{{ user?.username }}</div>
      </div>
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen && isAuthenticated"
      @click="handleClickOutside"
      class="fixed inset-0 z-40"
    ></div>

    <div
      v-if="isOpen && isAuthenticated"
      class="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg z-50 border border-border overflow-hidden"
    >
      <div class="px-4 py-3 border-b">
        <div class="text-sm font-semibold">{{ user?.firstName }} {{ user?.lastName }}</div>
        <div class="text-xs text-muted-foreground">{{ user?.email }}</div>
      </div>

      <div class="p-2">
        <NuxtLink
          to="/favorites"
          class="block px-3 py-2 text-sm rounded hover:bg-accent transition-colors"
          @click="isOpen = false"
        >
          ⭐ Mes favoris
        </NuxtLink>

        <NuxtLink
          to="/"
          class="block px-3 py-2 text-sm rounded hover:bg-accent transition-colors"
          @click="isOpen = false"
        >
          🎬 Parcourir les films
        </NuxtLink>
      </div>

      <div class="border-t p-2">
        <button
          @click="handleLogout"
          class="w-full text-left px-3 py-2 text-sm text-destructive rounded hover:bg-destructive/10 transition-colors"
        >
          Déconnexion
        </button>
      </div>
    </div>
  </div>
</template>
