<script setup lang="ts">
import { ref } from "vue";
import UserRow from "./UserRow.vue";
import UserService from "../services/user";

const { users } = defineProps(["users"]);
</script>

<template>
  <div>
    <div class="grid grid-cols-[100px_repeat(3,1fr)_50px] px-4 py-3">
      <div class="font-medium">ID</div>
      <div class="font-medium">Name</div>
      <div class="font-medium">Email</div>
      <div class="font-medium">Phone</div>
      <div class="font-medium">Actions</div>
    </div>
    <UserRow
      v-for="user in users"
      :key="user.id"
      :user="user"
      @delete="$emit('delete', $event)"
      @submit="$emit('submit', $event)"
    />
  </div>
</template>
