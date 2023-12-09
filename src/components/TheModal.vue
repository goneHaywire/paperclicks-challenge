<script setup lang="ts">
const { isOpen, title } = defineProps(["isOpen", "title"]);
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed z-10 inset-0 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex items-center justify-center min-h-screen">
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        />
        <article
          class="flex flex-col shadow-xl justify-self-center self-center bg-white md:max-w-4xl sm:w-full z-20 rounded-xl"
        >
          <header
            class="flex items-center justify-between border-b-gray-500 border-b px-8 py-6 text-xl text-gray-800 font-semibold"
          >
            <p>{{ title }}</p>
            <img
              @click="$emit('close-modal')"
              src="../assets/cross.svg"
              class="cursor-pointer w-5 mr-2"
            />
          </header>
          <main class="px-8 py-6">
            <slot></slot>
          </main>
        </article>
      </div>
    </div>
  </Teleport>
</template>
