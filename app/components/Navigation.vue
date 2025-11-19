<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const { isAuthenticated } = useAuth()
const router = useRouter()
const route = useRoute()
const q = ref('')

function linkClass(path: string) {
  const normalized = path.replace(/#.*$/, '')
  const active = (normalized === '/' && route.path === '/') || (normalized !== '/' && route.path.startsWith(normalized))
  return [
    'px-3 py-2 text-sm font-medium rounded-md transition-colors nav-link',
    active ? 'active' : ''
  ]
}

function goSearch() {
  if (!q.value) return
  router.push({ path: '/search', query: { q: q.value } })
}
</script>

<template>
  <nav class="sticky top-0 z-50 w-full border-b bg-brand-gray brand-backdrop">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center space-x-8">
          <NuxtLink to="/" class="flex items-center space-x-2 hover:opacity-80 transition-opacity">
        <span class="hidden sm:inline font-bold text-lg text-brand-yellow">MovieApp</span>
          </NuxtLink>

          <div class="hidden md:flex items-center space-x-1">
            <NuxtLink to="/" :class="linkClass('/')">Accueil</NuxtLink>
            <NuxtLink to="/films" :class="linkClass('/films')">Films</NuxtLink>
            <NuxtLink to="/#featured" :class="linkClass('/#featured')">À l'affiche</NuxtLink>
          </div>
        </div>

        <div class="hidden sm:flex flex-1 justify-center px-4">
          <form @submit.prevent="goSearch" class="w-full max-w-xl">
            <input
              v-model="q"
              type="search"
              placeholder="Rechercher un film, un réalisateur..."
              aria-label="Search movies"
              class="w-full rounded-full py-2 px-4 bg-muted/10 text-sm text-card-foreground placeholder:text-muted-foreground border border-transparent focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </form>
        </div>

        <div class="flex items-center space-x-4">
          <UserMenu v-if="isAuthenticated" />
          
          <NuxtLink 
            v-else
            to="/auth"
            :class="linkClass('/auth')"
          >
            Mon compte
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>

</template>
