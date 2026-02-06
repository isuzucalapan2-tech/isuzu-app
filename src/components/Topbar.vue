<template>
  <nav class="bg-gray-800 text-white">
    <div class="max-w-full mx-auto px-4">
      <div class="flex justify-between items-center h-16">

        <!-- Logo / Brand -->
        <div class="text-xl font-bold">
          ISUZU
        </div>

        <!-- Desktop Menu (centered) -->
        <div class="hidden md:flex flex-1 justify-center space-x-6">
          <router-link
            to="/dashboard"
            class="hover:text-gray-300 transition"
            active-class="font-bold underline"
          >
            Dashboard
          </router-link>

          <router-link
            to="/user-management"
            class="hover:text-gray-300 transition"
            active-class="font-bold underline"
          >
            User Management
          </router-link>

          <router-link
            to="/approve"
            class="hover:text-gray-300 transition"
            active-class="font-bold underline"
          >
            Approve
          </router-link>

          <router-link
            to="/inventory"
            class="hover:text-gray-300 transition"
            active-class="font-bold underline"
          >
            Inventory
          </router-link>

          <router-link
            to="/settings"
            class="hover:text-gray-300 transition"
            active-class="font-bold underline"
          >
            Settings
          </router-link>
        </div>

        <!-- Right side (optional: user/profile menu) -->
        <div class="hidden md:flex items-center space-x-4">
          <!-- You can add profile / logout button here -->
        </div>

        <!-- Mobile Hamburger -->
        <button
          class="md:hidden text-2xl"
          @click="isOpen = !isOpen"
        >
          ☰
        </button>

      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isOpen" class="md:hidden bg-gray-700 px-4 pb-4">
      <router-link
        to="/dashboard"
        class="block py-2"
        @click="isOpen = false"
      >Dashboard</router-link>

      <router-link
        to="/user-management"
        class="block py-2"
        @click="isOpen = false"
      >User Management</router-link>

      <router-link
        to="/approve"
        class="block py-2"
        @click="isOpen = false"
      >Approve</router-link>

      <router-link
        to="/inventory"
        class="block py-2"
        @click="isOpen = false"
      >Inventory</router-link>

      <router-link
        to="/settings"
        class="block py-2"
        @click="isOpen = false"
      >Settings</router-link>
    </div>

  </nav>
</template>

<script setup>
import { ref } from "vue";
const isOpen = ref(false);
</script>

<style scoped>
/* Optional: Add hover underline effect for links */
router-link {
  transition: all 0.2s;
}
</style>
