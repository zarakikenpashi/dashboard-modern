<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { Check, ChevronsUpDown, Search } from '@lucide/vue'

const props = defineProps({
  modelValue: { type: String, default: null },
  items: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Sélectionner…' },
  searchPlaceholder: { type: String, default: 'Rechercher…' },
  emptyText: { type: String, default: 'Aucun résultat.' },
  disabled: { type: Boolean, default: false },
  width: { type: String, default: '220px' },
  scrollContainer: { type: String, default: null },
})

const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const query = ref('')
const activeIdx = ref(-1)
const placement = ref('bottom') // 'bottom' | 'top'
const rootRef = ref(null)
const triggerRef = ref(null)
const searchRef = ref(null)

const selected = computed(() => props.items.find((i) => i.value === props.modelValue) ?? null)

const filtered = computed(() => {
  const q = query.value.toLowerCase().trim()
  return q ? props.items.filter((i) => i.label.toLowerCase().includes(q)) : props.items
})

function toggle() {
  if (props.disabled) return
  if (open.value) {
    closePopover()
  } else {
    openPopover()
  }
}

function getScrollParent() {
  if (!props.scrollContainer) return null
  return document.querySelector(props.scrollContainer)
}

function openPopover() {
  if (triggerRef.value) {
    const triggerRect = triggerRef.value.getBoundingClientRect()
    const popoverH = Math.min(props.items.length * 36 + 44, 264)
    const container = getScrollParent()

    let spaceBelow, spaceAbove
    if (container) {
      const containerRect = container.getBoundingClientRect()
      spaceBelow = containerRect.bottom - triggerRect.bottom
      spaceAbove = triggerRect.top - containerRect.top
    } else {
      spaceBelow = window.innerHeight - triggerRect.bottom
      spaceAbove = triggerRect.top
    }

    placement.value = spaceBelow >= popoverH || spaceBelow >= spaceAbove ? 'bottom' : 'top'
  }
  open.value = true
  query.value = ''
  activeIdx.value = -1
  nextTick(() => searchRef.value?.focus())
}

function closePopover() {
  open.value = false
  query.value = ''
  activeIdx.value = -1
  nextTick(() => triggerRef.value?.focus())
}

function select(value) {
  emit('update:modelValue', value === props.modelValue ? null : value)
  closePopover()
}

function onKeydown(e) {
  const list = filtered.value
  if (e.key === 'ArrowDown') {
    activeIdx.value = Math.min(activeIdx.value + 1, list.length - 1)
    e.preventDefault()
  } else if (e.key === 'ArrowUp') {
    activeIdx.value = Math.max(activeIdx.value - 1, 0)
    e.preventDefault()
  } else if (e.key === 'Enter') {
    if (activeIdx.value >= 0 && list[activeIdx.value]) {
      select(list[activeIdx.value].value)
    }
    e.preventDefault()
  } else if (e.key === 'Escape') {
    closePopover()
  }
}

function onClickOutside(e) {
  if (open.value && rootRef.value && !rootRef.value.contains(e.target)) {
    closePopover()
  }
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', onClickOutside))
</script>

<template>
  <div ref="rootRef" class="cb-root" :style="{ width }">
    <!-- Trigger -->
    <button
      ref="triggerRef"
      type="button"
      class="cb-trigger"
      :class="{ 'cb-trigger--open': open, 'cb-trigger--disabled': disabled }"
      :aria-expanded="open"
      :aria-haspopup="true"
      :disabled="disabled"
      @click="toggle"
    >
      <span :class="['cb-trigger__label', { 'cb-trigger__label--ph': !selected }]">
        {{ selected?.label ?? placeholder }}
      </span>
      <ChevronsUpDown
        :size="14"
        class="cb-trigger__icon"
        :class="{ 'cb-trigger__icon--open': open }"
        aria-hidden="true"
      />
    </button>

    <!-- Popover -->
    <Transition name="cb-pop">
      <div v-if="open" class="cb-popover" :class="`cb-popover--${placement}`" role="listbox">
        <!-- Search -->
        <div class="cb-search-wrap">
          <Search :size="13" class="cb-search-icon" aria-hidden="true" />
          <input
            ref="searchRef"
            v-model="query"
            class="cb-search"
            type="text"
            :placeholder="searchPlaceholder"
            autocomplete="off"
            @keydown="onKeydown"
          />
        </div>

        <!-- List -->
        <ul class="cb-list" role="group">
          <li v-if="filtered.length === 0" class="cb-empty">
            {{ emptyText }}
          </li>

          <li
            v-for="(item, i) in filtered"
            :key="item.value"
            class="cb-item"
            :class="{
              'cb-item--selected': modelValue === item.value,
              'cb-item--active': i === activeIdx,
            }"
            role="option"
            :aria-selected="modelValue === item.value"
            @mousedown.prevent="select(item.value)"
          >
            <span class="cb-item__label">{{ item.label }}</span>
            <Check
              :size="14"
              class="cb-item__check"
              :class="{ 'cb-item__check--visible': modelValue === item.value }"
              aria-hidden="true"
            />
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.cb-root {
  --cb-primary: #2a39ff;
  --cb-fg: #00095b;
  --cb-bg: #ffffff;
  --cb-muted: #eef0f8;
  --cb-muted-fg: #5f6b7c;
  --cb-border: #e4e7ef;
  --cb-ring: rgba(42, 57, 255, 0.15);
  --cb-radius: 0.65rem;
  --cb-radius-sm: calc(var(--cb-radius) - 2px);

  position: relative;
  display: inline-block;
  font-family: inherit;
}

.cb-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  height: 36px;
  padding: 0 10px 0 12px;
  background: var(--cb-bg);
  border: 1px solid var(--cb-border);
  border-radius: var(--cb-radius);
  font-size: 14px;
  color: var(--cb-fg);
  cursor: pointer;
  white-space: nowrap;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
  font-family: inherit;
}
.cb-trigger:hover:not(.cb-trigger--disabled) {
  border-color: #c0c8e8;
}
.cb-trigger--open {
  border-color: var(--cb-primary);
  box-shadow: 0 0 0 3px var(--cb-ring);
}
.cb-trigger--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cb-trigger__label {
  flex: 1;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cb-trigger__label--ph {
  color: var(--cb-muted-fg);
}

.cb-trigger__icon {
  flex-shrink: 0;
  color: var(--cb-muted-fg);
  transition: transform 0.2s;
}
.cb-trigger__icon--open {
  transform: rotate(180deg);
  color: var(--cb-primary);
}

.cb-popover {
  position: absolute;
  left: 0;
  min-width: 100%;
  background: var(--cb-bg);
  border: 1px solid var(--cb-border);
  border-radius: var(--cb-radius);
  box-shadow: 0 4px 20px rgba(0, 9, 91, 0.1);
  z-index: 50;
  overflow: hidden;
}
.cb-popover--bottom {
  top: calc(100% + 6px);
  transform-origin: top center;
}
.cb-popover--top {
  bottom: calc(100% + 6px);
  transform-origin: bottom center;
}

.cb-search-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 10px;
  border-bottom: 1px solid var(--cb-border);
}
.cb-search-icon {
  flex-shrink: 0;
  color: var(--cb-muted-fg);
}
.cb-search {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  color: var(--cb-fg);
  font-family: inherit;
}
.cb-search::placeholder {
  color: var(--cb-muted-fg);
}

.cb-list {
  list-style: none;
  margin: 0;
  padding: 4px;
  max-height: 220px;
  overflow-y: auto;
  scroll-behavior: smooth;
}
.cb-empty {
  padding: 14px 8px;
  text-align: center;
  font-size: 13px;
  color: var(--cb-muted-fg);
}

.cb-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 8px;
  border-radius: var(--cb-radius-sm);
  font-size: 13px;
  color: var(--cb-fg);
  cursor: pointer;
  user-select: none;
  transition: background 0.1s;
}
.cb-item:hover,
.cb-item--active {
  background: var(--cb-muted);
}
.cb-item--selected {
  background: rgba(42, 57, 255, 0.07);
  color: var(--cb-primary);
  font-weight: 500;
}
.cb-item__label {
  flex: 1;
}
.cb-item__check {
  flex-shrink: 0;
  color: var(--cb-primary);
  opacity: 0;
  transition: opacity 0.12s;
}
.cb-item__check--visible {
  opacity: 1;
}

.cb-pop-enter-active,
.cb-pop-leave-active {
  transition:
    opacity 0.14s,
    transform 0.14s;
}
.cb-pop-enter-from,
.cb-pop-leave-to {
  opacity: 0;
  transform: scaleY(0.95);
}

@media (max-width: 480px) {
  .cb-root {
    width: 100% !important;
  }
}
</style>
