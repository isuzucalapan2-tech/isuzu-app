<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Firebase/Firebase';

const router = useRouter();

onMounted(() => {
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

