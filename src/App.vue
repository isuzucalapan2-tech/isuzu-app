<template>
  <div id="app" :class="themeClass" :style="themeStyle">
    <router-view></router-view>
  </div>
</template>


<script setup>
import { onMounted, watch, computed } from 'vue';

import { useRouter, useRoute } from 'vue-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Firebase/Firebase';

const router = useRouter();
const route = useRoute();

// Theme detection
const isDarkMode = computed(() => {
  return document.documentElement.classList.contains('dark');
});

const themeClass = computed(() => 
  isDarkMode.value ? 'text-white' : 'bg-gray-100 text-gray-900'
);

const themeStyle = computed(() => 
  isDarkMode.value ? { backgroundColor: '#232323' } : {}
);

// Apply theme globally

const applyTheme = (theme) => {
  const html = document.documentElement;
  html.classList.remove('dark', 'light');
  
  if (theme === 'dark') {
    html.classList.add('dark');
  } else if (theme === 'light') {
    html.classList.add('light');
  } else if (theme === 'auto') {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      html.classList.add('dark');
    } else {
      html.classList.add('light');
    }
  }
};

// Load and apply saved theme on mount
onMounted(() => {
  const savedTheme = localStorage.getItem('appTheme');
  if (savedTheme) {
    applyTheme(savedTheme);
  }

  onAuthStateChanged(auth, (user) => {
    if (!user && router.currentRoute.value.name !== 'Login') {
      router.replace({
        name: 'Login',
        query: { session: 'expired' }
      });
    }
  });
});
</script>
