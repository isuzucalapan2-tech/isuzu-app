<!-- Sidebar.vue -->
<template>
  <div class="h-screen w-64 bg-gray-800 text-white flex flex-col">
    <!-- Logo / Brand -->
    <div class="p-6 text-2xl font-bold border-b border-gray-700">
      MyApp
    </div>

    <!-- Menu Items -->
    <nav class="flex-1 p-4">
      <ul class="space-y-4">

        <li>
          <router-link
            to="/dashboard"
            class="flex items-center p-2 rounded hover:bg-gray-700 transition"
            active-class="bg-gray-700"
          >
            <span class="ml-2">Dashboard</span>
          </router-link>
        </li>

        <li>
          <router-link
            to="/users"
            class="flex items-center p-2 rounded hover:bg-gray-700 transition"
            active-class="bg-gray-700"
          >
            <span class="ml-2">User Management</span>
          </router-link>
        </li>

        <li>
          <router-link
            to="/approve"
            class="flex items-center p-2 rounded hover:bg-gray-700 transition"
            active-class="bg-gray-700"
          >
            <span class="ml-2">Approve</span>
          </router-link>
        </li>

        <li>
          <router-link
            to="/inventory"
            class="flex items-center p-2 rounded hover:bg-gray-700 transition"
            active-class="bg-gray-700"
          >
            <span class="ml-2">Inventory</span>
          </router-link>
        </li>

        <li>
          <router-link
            to="/settings"
            class="flex items-center p-2 rounded hover:bg-gray-700 transition"
            active-class="bg-gray-700"
          >
            <span class="ml-2">Settings</span>
          </router-link>
        </li>

      </ul>
    </nav>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style scoped>
</style>
