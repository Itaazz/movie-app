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
    <button
      @click="isOpen = !isOpen"
      v-if="isAuthenticated"
      class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
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
      class="absolute right-0 mt-2 w-56 bg-black/60 text-white rounded-lg shadow-2xl z-50 border border-white/10 overflow-hidden backdrop-blur-sm"
    >
      <div class="px-4 py-3 border-b border-white/10 bg-black/50">
        <div class="text-sm font-semibold text-white">{{ user?.firstName }} {{ user?.lastName }}</div>
        <div class="text-xs text-white/80">{{ user?.email }}</div>
      </div>

      <div class="p-2">
        <NuxtLink
          to="/mes-films"
          class="block px-3 py-2 text-sm rounded hover:bg-white/10 transition-colors text-white"
          @click="isOpen = false"
        >
          Mes films
        </NuxtLink>
      </div>

      <div class="border-t border-white/5 p-2">
        <button
          @click="handleLogout"
          class="w-full text-left px-3 py-2 text-sm text-red-400 rounded hover:bg-red-600/20 transition-colors"
        >
          Déconnexion
        </button>
      </div>
    </div>
  </div>
</template>
