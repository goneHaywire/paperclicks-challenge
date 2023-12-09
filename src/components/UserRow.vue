<script setup lang="ts">
import { ref } from "vue";
import UserService from "../services/user";
import UserForm from "./UserForm.vue";
import TheModal from "./TheModal.vue";
const { user } = defineProps(["user"]);

const emit = defineEmits();

const isModalOpen = ref(false);

const onSubmit = (val) =>
  emit("submit", { ...val, closeModal: () => (isModalOpen.value = false) });
</script>

<template>
  <div
    class="grid grid-cols-[100px_repeat(3,1fr)_50px] border border-gray-300 rounded-md py-3 px-4 mb-2 text-gray-500 font-light"
  >
    <span>{{ user.id }}</span>
    <span>{{ user.name }}</span>
    <span>{{ user.email }}</span>
    <span>{{ user.phone }}</span>
    <div class="flex justify-evenly">
      <img
        @click="isModalOpen = true"
        src="../assets/pencil.svg"
        class="cursor-pointer w-5"
      />
      <img
        @click="$emit('delete', user.id)"
        src="../assets/trash.svg"
        class="cursor-pointer w-5"
      />
    </div>
  </div>

  <TheModal
    title="Edit User Info"
    :isOpen="isModalOpen"
    @close-modal="isModalOpen = false"
  >
    <UserForm :user="{ ...user }" @submit="onSubmit" />
  </TheModal>
</template>
