<script setup lang="ts">
const { login, register, user } = useAuth()
const router = useRouter()

const isLoginMode = ref(true)
const formData = ref({
  email: '',
  password: '',
  username: '',
  firstName: '',
  lastName: ''
})
const error = ref('')
const isLoading = ref(false)

// Si déjà connecté, rediriger
if (user.value) {
  router.push('/')
}

const handleSubmit = async () => {
  error.value = ''
  isLoading.value = true

  try {
    if (isLoginMode.value) {
      await login({
        email: formData.value.email,
        password: formData.value.password
      })
    } else {
      await register({
        email: formData.value.email,
        password: formData.value.password,
        username: formData.value.username,
        firstName: formData.value.firstName,
        lastName: formData.value.lastName
      })
    }
    
    router.push('/')
  } catch (e: any) {
    error.value = e.data?.message || 'Une erreur est survenue'
  } finally {
    isLoading.value = false
  }
}

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  error.value = ''
}

// Remplir automatiquement avec le compte de démo
const fillDemo = () => {
  formData.value.email = 'demo@example.com'
  formData.value.password = 'demo123'
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-6">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 class="text-3xl font-bold mb-6 text-center">
        {{ isLoginMode ? 'Connexion' : 'Inscription' }}
      </h1>

      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Champs inscription uniquement -->
        <div v-if="!isLoginMode" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Nom d'utilisateur</label>
            <input 
              v-model="formData.username"
              type="text"
              required
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Prénom</label>
              <input 
                v-model="formData.firstName"
                type="text"
                required
                class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Nom</label>
              <input 
                v-model="formData.lastName"
                type="text"
                required
                class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <!-- Champs communs -->
        <div>
          <label class="block text-sm font-medium mb-1">Email</label>
          <input 
            v-model="formData.email"
            type="email"
            required
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Mot de passe</label>
          <input 
            v-model="formData.password"
            type="password"
            required
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button 
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {{ isLoading ? 'Chargement...' : (isLoginMode ? 'Se connecter' : 'S\'inscrire') }}
        </button>
      </form>

      <!-- Bouton compte démo -->
      <button 
        v-if="isLoginMode"
        @click="fillDemo"
        type="button"
        class="w-full mt-3 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
      >
        Utiliser le compte démo
      </button>

      <!-- Toggle mode -->
      <div class="mt-6 text-center">
        <button 
          @click="toggleMode"
          type="button"
          class="text-blue-600 hover:underline"
        >
          {{ isLoginMode ? 'Pas encore de compte ? S\'inscrire' : 'Déjà un compte ? Se connecter' }}
        </button>
      </div>
    </div>
  </div>
</template>
