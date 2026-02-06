<template>
  <nav class="bg-neutral-900 text-white">
    <div class="max-w-full mx-auto px-4">
      <div class="flex justify-between items-center h-16">

        <!-- Logo / Brand -->
        <div class="text-xl font-extrabold text-red-600 tracking-widest">
          ISUZU
        </div>

        <!-- Desktop Menu (centered) -->
        <div class="hidden md:flex flex-1 justify-center space-x-6">
          <router-link
            to="/dashboard"
            class="hover:text-neutral-300 transition"
            active-class="font-bold underline underline-offset-4"
          >
            Dashboard
          </router-link>

          <router-link
            to="/user-management"
            class="hover:text-neutral-300 transition"
            active-class="font-bold underline underline-offset-4"
          >
            User Management
          </router-link>

          <router-link
            to="/approve"
            class="hover:text-neutral-300 transition"
            active-class="font-bold underline underline-offset-4"
          >
            Approve
          </router-link>

          <router-link
            to="/inventory"
            class="hover:text-neutral-300 transition"
            active-class="font-bold underline underline-offset-4"
          >
            Inventory
          </router-link>

          <router-link
            to="/settings"
            class="hover:text-neutral-300 transition"
            active-class="font-bold underline underline-offset-4"
          >
            Settings
          </router-link>
        </div>

        <!-- Right side -->
        <div class="hidden md:flex items-center space-x-4">
          <!-- profile / logout -->
        </div>

        <!-- Mobile Hamburger -->
        <button
          class="md:hidden text-2xl text-white"
          @click="isOpen = !isOpen"
        >
          ☰
        </button>

      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isOpen" class="md:hidden bg-neutral-800 px-4 pb-4">
      <router-link
        to="/dashboard"
        class="block py-2 hover:text-neutral-300"
        @click="isOpen = false"
      >Dashboard</router-link>

      <router-link
        to="/user-management"
        class="block py-2 hover:text-neutral-300"
        @click="isOpen = false"
      >User Management</router-link>

      <router-link
        to="/approve"
        class="block py-2 hover:text-neutral-300"
        @click="isOpen = false"
      >Approve</router-link>

      <router-link
        to="/inventory"
        class="block py-2 hover:text-neutral-300"
        @click="isOpen = false"
      >Inventory</router-link>

      <router-link
        to="/settings"
        class="block py-2 hover:text-neutral-300"
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
router-link {
  transition: all 0.2s ease;
}
</style>
