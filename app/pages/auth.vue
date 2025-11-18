<script setup lang="ts">
import { ref, reactive } from 'vue'

const { register, login } = useAuth()
const router = useRouter()

const mode = ref<'login' | 'register'>('login')

const loginForm = reactive({
  email: 'demo@example.com',
  password: 'demo123'
})

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  firstName: '',
  lastName: ''
})

const isLoading = ref(false)
const error = ref('')

const handleLogin = async () => {
  isLoading.value = true
  error.value = ''

  try {
    await login(loginForm)
    router.push('/')
  } catch (err: any) {
    error.value = err.message || 'Erreur de connexion'
  } finally {
    isLoading.value = false
  }
}

const handleRegister = async () => {
  isLoading.value = true
  error.value = ''

  try {
    await register(registerForm)
    router.push('/')
  } catch (err: any) {
    error.value = err.message || 'Erreur lors de l\'inscription'
  } finally {
    isLoading.value = false
  }
}

const fillDemoCredentials = () => {
  loginForm.email = 'demo@example.com'
  loginForm.password = 'demo123'
  mode.value = 'login'
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/10 px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Card -->
      <div class="bg-card rounded-lg shadow-lg border border-border overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-primary to-primary/80 px-6 py-8">
          <div class="flex items-center justify-center space-x-3 mb-4">
            <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <span class="text-white text-2xl">🎬</span>
            </div>
            <h1 class="text-white text-2xl font-bold">MovieApp</h1>
          </div>
          <p class="text-red-100 text-center">
            {{ mode === 'login' ? 'Connectez-vous à votre compte' : 'Créez votre compte' }}
          </p>
        </div>

        <!-- Content -->
        <div class="px-6 py-8">
          <!-- Error Message -->
          <div v-if="error" class="mb-4 p-3 bg-destructive/10 border border-destructive text-destructive rounded-lg text-sm">
            {{ error }}
          </div>

          <!-- Login Form -->
          <div v-if="mode === 'login'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Email</label>
              <input
                v-model="loginForm.email"
                type="email"
                class="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Mot de passe</label>
              <input
                v-model="loginForm.password"
                type="password"
                class="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>

            <button
              @click="handleLogin"
              :disabled="isLoading"
              class="w-full py-2 px-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {{ isLoading ? 'Connexion...' : 'Se connecter' }}
            </button>

            <!-- Demo Account Button -->
            <button
              @click="fillDemoCredentials"
              class="w-full py-2 px-4 border-2 border-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/10 transition-colors text-sm"
            >
              Utiliser le compte démo
            </button>
          </div>

          <!-- Register Form -->
          <div v-if="mode === 'register'" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2">Prénom</label>
                <input
                  v-model="registerForm.firstName"
                  type="text"
                  class="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Jean"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">Nom</label>
                <input
                  v-model="registerForm.lastName"
                  type="text"
                  class="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Dupont"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Nom d'utilisateur</label>
              <input
                v-model="registerForm.username"
                type="text"
                class="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="jeandupont"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Email</label>
              <input
                v-model="registerForm.email"
                type="email"
                class="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Mot de passe</label>
              <input
                v-model="registerForm.password"
                type="password"
                class="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>

            <button
              @click="handleRegister"
              :disabled="isLoading"
              class="w-full py-2 px-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {{ isLoading ? 'Création...' : 'Créer un compte' }}
            </button>
          </div>

          <!-- Toggle Mode -->
          <div class="mt-6 text-center text-sm">
            <span class="text-muted-foreground">
              {{ mode === 'login' ? 'Pas encore de compte ?' : 'Vous avez déjà un compte ?' }}
            </span>
            <button
              @click="mode = mode === 'login' ? 'register' : 'login'"
              class="ml-2 text-primary font-semibold hover:underline"
            >
              {{ mode === 'login' ? 'S\'inscrire' : 'Se connecter' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-6 text-center text-sm text-muted-foreground">
        <p>MovieApp © 2025 - Plateforme de gestion de films</p>
      </div>
    </div>
  </div>
</template>
