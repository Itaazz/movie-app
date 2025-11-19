<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{ modelValue: number | null, max?: number }>()
const emit = defineEmits(['update:modelValue','rated'])

const max = props.max ?? 5
const hover = ref<number | null>(null)

const value = computed({
  get: () => props.modelValue ?? null,
  set: (v: number | null) => emit('update:modelValue', v)
})

function onClick (n: number) {
  value.value = n
  emit('rated', n)
}

function onMouseEnter (n: number) {
  hover.value = n
}

function onMouseLeave () {
  hover.value = null
}

watch(() => props.modelValue, (v) => { })
</script>

<template>
  <div class="flex items-center" role="radiogroup" aria-label="Notation">
    <button
      v-for="n in max"
      :key="n"
      type="button"
      @click="onClick(n)"
      @mouseenter="onMouseEnter(n)"
      @mouseleave="onMouseLeave"
      :aria-checked="(modelValue ?? 0) >= n"
      role="radio"
      class="p-1"
    >
      <svg v-if="(hover ?? modelValue ?? 0) >= n" xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-yellow-400 transition-transform transform hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .587l3.668 7.431L23.6 9.75l-5.8 5.647L19.335 24 12 19.897 4.665 24l1.535-8.603L.4 9.75l7.932-1.732L12 .587z" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-gray-400 transition-transform transform hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M12 .587l3.668 7.431L23.6 9.75l-5.8 5.647L19.335 24 12 19.897 4.665 24l1.535-8.603L.4 9.75l7.932-1.732L12 .587z" />
      </svg>
    </button>
  </div>
</template>
