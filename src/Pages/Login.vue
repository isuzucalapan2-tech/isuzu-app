<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
      <h2 class="text-3xl font-bold text-center mb-6 text-gray-800">
        Login to Isuzu Inventory
      </h2>

      <form @submit.prevent="login">
        <!-- Email -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-1 font-medium">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <!-- Password -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-1 font-medium">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your password"
          />
        </div>

        <!-- Error -->
        <p v-if="error" class="text-red-500 text-sm mb-4 text-center">
          {{ error }}
        </p>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Login
        </button>
      </form>

      <p class="text-center text-sm text-gray-600 mt-4">
        Don’t have an account?
        <router-link to="/register" class="text-blue-600 hover:underline">
          Register
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase/Firebase";  // fixed path

const email = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();

const login = async () => {
  error.value = "";
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push("/dashboard");  // redirect after login
  } catch (err) {
    // friendly error messages
    if (err.code === "auth/user-not-found") {
      error.value = "User not found";
    } else if (err.code === "auth/wrong-password") {
      error.value = "Wrong password";
    } else if (err.code === "auth/invalid-email") {
      error.value = "Invalid email address";
    } else {
      error.value = err.message;
    }
  }
};
</script>

<style scoped>
/* optional: add smooth font */
body {
  font-family: 'Inter', sans-serif;
}
</style>
