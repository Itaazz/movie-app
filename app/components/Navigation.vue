<script setup lang="ts">
const { user, logout, isAuthenticated } = useAuth()
const router = useRouter()

const handleLogout = () => {
  logout()
  router.push('/auth')
}
</script>

<template>
  <nav class="bg-blue-600 text-white shadow-lg">
    <div class="container mx-auto px-6 py-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-6">
          <NuxtLink to="/" class="text-xl font-bold hover:text-blue-200">
            🎬 MovieApp
          </NuxtLink>
          
          <NuxtLink 
            to="/" 
            class="hover:text-blue-200 transition-colors"
          >
            Films
          </NuxtLink>

          <NuxtLink 
            v-if="isAuthenticated"
            to="/favorites" 
            class="hover:text-blue-200 transition-colors"
          >
            ⭐ Mes favoris
          </NuxtLink>
        </div>

        <div class="flex items-center space-x-4">
          <template v-if="isAuthenticated">
            <span class="text-sm">
              Bonjour, {{ user?.firstName }} 👋
            </span>
            <button 
              @click="handleLogout"
              class="px-4 py-2 bg-blue-700 rounded hover:bg-blue-800 transition-colors"
            >
              Déconnexion
            </button>
          </template>
          
          <template v-else>
            <NuxtLink 
              to="/auth"
              class="px-4 py-2 bg-blue-700 rounded hover:bg-blue-800 transition-colors"
            >
              Connexion
            </NuxtLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>
