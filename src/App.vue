<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import HelloWorld from "./components/HelloWorld.vue";
import UserList from "./components/UserList.vue";
import TheModal from "./components/TheModal.vue";
import UserForm from "./components/UserForm.vue";
import { emptyUser, validateUser } from "./interfaces/user";
import UserService from "./services/user";
import { ZodError } from "zod";
import * as R from "ramda";

const isModalOpen = ref(false);
const users = ref([]);

const getAllUsers = () =>
  UserService.getAll().then(({ data }) => (users.value = data));

onMounted(getAllUsers);

const deleteUser = (id) =>
  UserService.delete(id)
    .then(() => R.reject(R.propEq(id, "id"), users.value))
    .then((newUsers) => (users.value = newUsers));

const createUser = ({ user, setErrors }) =>
  validateUser(user)
    .then(UserService.create)
    .then(R.prop("data"))
    .then((newUser) => {
      users.value.push(newUser);
    })
    .then(() => (isModalOpen.value = false))
    .catch((err: Error) => {
      if (err instanceof ZodError) {
        setErrors(err.issues);
      }
    });

const updateUser = ({ user, setErrors, closeModal }) =>
  validateUser(user)
    .then(UserService.update)
    .then(R.prop("data"))
    .then((newUser) => {
      const index = R.findIndex(R.propEq(user.id, "id"), users.value);
      users.value = R.update(index, newUser, users.value);
    })
    .then(closeModal)
    .catch((err: Error) => {
      if (err instanceof ZodError) {
        setErrors(err.issues);
      }
    });
</script>

<template>
  <div class="p-8 grid grid-rows-[50px_1fr] gap-4">
    <div class="flex justify-end">
      <button
        @click="isModalOpen = true"
        class="flex items-center bg-blue-600 rounded-md text-white px-4 py-1 text-md"
      >
        <img src="./assets/plus.svg" class="w-5 h-5 text-white" />
        Create New User
      </button>
    </div>
    <UserList :users="users" @submit="updateUser" @delete="deleteUser" />
  </div>
  <TheModal
    title="New User Info"
    :isOpen="isModalOpen"
    @close-modal="isModalOpen = false"
  >
    <UserForm :user="{}" @submit="createUser" />
  </TheModal>
</template>
