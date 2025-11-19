<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

const props = defineProps({
  items: { type: Array as () => any[], default: () => [] },
  showArrows: { type: Boolean, default: true }
})

const slidesPerView = ref(4)
const track = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const startX = ref(0)
const scrollStart = ref(0)

function updateSlidesPerView() {
  const w = window.innerWidth
  if (w < 640) slidesPerView.value = 1
  else if (w < 768) slidesPerView.value = 2
  else if (w < 1024) slidesPerView.value = 3
  else slidesPerView.value = 4
}

onMounted(() => {
  updateSlidesPerView()
  window.addEventListener('resize', updateSlidesPerView)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateSlidesPerView)
})

const canShowArrows = computed(() => props.showArrows && (props.items?.length ?? 0) > slidesPerView.value)

function prev() {
  if (!track.value) return
  track.value.scrollBy({ left: -track.value.clientWidth * 0.9, behavior: 'smooth' })
}

function next() {
  if (!track.value) return
  track.value.scrollBy({ left: track.value.clientWidth * 0.9, behavior: 'smooth' })
}

function onPointerDown(e: PointerEvent) {
  if (!track.value) return
  const target = e.target as HTMLElement
  if (target.closest && target.closest('a,button,svg')) return
  isDragging.value = true
  startX.value = e.clientX
  scrollStart.value = track.value.scrollLeft
  try { track.value.setPointerCapture?.(e.pointerId) } catch {}
  document.body.style.userSelect = 'none'
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging.value || !track.value) return
  const dx = e.clientX - startX.value
  track.value.scrollLeft = scrollStart.value - dx
}

function onPointerUp(e: PointerEvent) {
  if (!track.value) return
  isDragging.value = false
  try { track.value.releasePointerCapture?.(e.pointerId) } catch {}
  document.body.style.userSelect = ''
}
</script>

<template>
  <div class="relative">
    <button
      v-if="canShowArrows"
      @click="prev"
      class="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-2"
      aria-label="Précédent"
    >
      ‹
    </button>

    <div
      ref="track"
      class="overflow-x-auto scrollbar-none"
      style="scroll-behavior: smooth; -webkit-overflow-scrolling: touch;"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointerleave="onPointerUp"
      @pointercancel="onPointerUp"
      :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
    >
      <div class="flex gap-4 items-stretch" style="scroll-snap-type: x mandatory;">
        <div
          v-for="(item, idx) in items"
          :key="(item && (item.id ?? item._id)) ?? idx"
          class="flex-shrink-0 p-2"
          :style="{ width: `${100 / slidesPerView}%`, scrollSnapAlign: 'start' }"
        >
          <slot :item="item" :index="idx" />
        </div>
      </div>
    </div>

    <button
      v-if="canShowArrows"
      @click="next"
      class="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-2"
      aria-label="Suivant"
    >
      ›
    </button>
  </div>
</template>
