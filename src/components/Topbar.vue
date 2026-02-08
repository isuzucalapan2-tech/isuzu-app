<template>
  <nav class="bg-neutral-900 text-white">
    <div class="max-w-full mx-auto px-4">
      <div class="flex justify-between items-center h-16">

        <!-- Logo / Brand -->
        <div class="usuzi-font isuzu-logo">
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

        <!-- Theme Toggle Switch -->
        <div class="flex items-center gap-3">
          <button
            @click="toggleTheme"
            class="relative w-16 h-8 rounded-full transition"
            :class="theme === 'dark' ? 'bg-blue-900' : 'bg-yellow-300'"
            style="box-shadow: 0 2px 8px rgba(0,0,0,0.08);"
          >
            <span
              class="absolute top-1 left-1 transition-all duration-300"
              :style="theme === 'dark'
                ? 'transform: translateX(32px);'
                : 'transform: translateX(0);'"
            >
              <component
                :is="theme === 'dark' ? MoonIcon : SunIcon"
                class="w-6 h-6"
                :class="theme === 'dark' ? 'text-blue-400' : 'text-yellow-600'"
              />
            </span>
          </button>
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
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { SunIcon, MoonIcon } from "lucide-vue-next";

const isOpen = ref(false);

// Theme logic
const theme = ref(localStorage.getItem('appTheme') || 'light');

const applyTheme = (val) => {
  const html = document.documentElement;
  html.classList.remove('dark', 'light');
  if (val === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.add('light');
  }
};

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
};

watch(theme, (val) => {
  applyTheme(val);
  localStorage.setItem('appTheme', val);
}, { immediate: true });

onMounted(() => {
  applyTheme(theme.value);

  // Listen for theme changes in other tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'appTheme') {
      theme.value = e.newValue || 'light';
      applyTheme(theme.value);
    }
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('storage', () => {});
});
</script>

<style>
@font-face {
  font-family: 'Usuzi';
  src: url('../assets/usuzi/usuzi.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

/* Optional: Add hover underline effect for links */
router-link {
  transition: all 0.2s;
}

.usuzi-font {
  font-family: 'Usuzi', sans-serif;
}

.isuzu-logo {
  font-size: 2rem; /* Adjust as needed */
  font-weight: bold;
  color: #fe0103;
}</style>