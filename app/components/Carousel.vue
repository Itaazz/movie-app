<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

const props = defineProps({
  items: { type: Array as () => any[], default: () => [] },
  showArrows: { type: Boolean, default: false }
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
  setTimeout(() => {
    if (track.value) {
      track.value.addEventListener('scroll', updateFadeVisibility, { passive: true })
      updateFadeVisibility()
    }
  }, 0)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateSlidesPerView)
  if (track.value) track.value.removeEventListener('scroll', updateFadeVisibility)
})

const canShowArrows = computed(() => props.showArrows && (props.items?.length ?? 0) > slidesPerView.value)

const showFadeLeft = ref(false)
const showFadeRight = ref(false)

function updateFadeVisibility() {
  if (!track.value) {
    showFadeLeft.value = false
    showFadeRight.value = false
    return
  }
  const el = track.value
  const maxScroll = el.scrollWidth - el.clientWidth
  showFadeLeft.value = el.scrollLeft > 8
  showFadeRight.value = el.scrollLeft < (maxScroll - 8)
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
    <div v-show="(props.items?.length ?? 0) > slidesPerView && showFadeLeft" class="absolute left-0 top-0 bottom-0 w-14 pointer-events-none">
      <div class="carousel-fade-left h-full w-full"></div>
    </div>

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

    <div v-show="(props.items?.length ?? 0) > slidesPerView && showFadeRight" class="absolute right-0 top-0 bottom-0 w-14 pointer-events-none">
      <div class="carousel-fade-right h-full w-full"></div>
    </div>
  </div>
</template>

<style scoped>
.carousel-fade-left {
  background: linear-gradient(to right, rgba(0,0,0,0.45), rgba(0,0,0,0));
  transition: opacity 220ms ease;
}
.carousel-fade-right {
  background: linear-gradient(to left, rgba(0,0,0,0.45), rgba(0,0,0,0));
  transition: opacity 220ms ease;
}

.carousel-fade-left,
.carousel-fade-right {
  opacity: 1;
}
</style>
