<template>
  <div class="min-h-screen flex flex-col lg:flex-row">

    <!-- Left side: Login Form Section -->
    <section class="lg:w-2/5 flex items-center justify-center p-12 bg-white">
      <div class="w-full max-w-md">
        <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h2>

        <form @submit.prevent="login">
          <!-- Username or Email -->
          <div class="mb-4">
            <label class="block text-gray-800 mb-1 font-medium">Username or Email</label>
            <input
              v-model="identifier"
              type="text"
              required
              class="w-full px-4 py-2 border border-black rounded-lg focus:outline-none bg-white text-gray-800"
              placeholder="Enter username or email"
            />
          </div>

          <!-- Password -->
          <div class="mb-4 relative">
            <label class="block text-gray-800 mb-1 font-medium">Password</label>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full px-4 py-2 border border-black rounded-lg focus:outline-none bg-white text-gray-800"
              placeholder="Enter your password"
            />

            <!-- Toggle Button -->
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-9 text-gray-600 hover:text-gray-900"
            >
              {{ showPassword ? "Hide" : "Show" }}
            </button>
          </div>

          <!-- Error -->
          <p v-if="error" class="text-red-600 text-sm mb-4 text-center">
            {{ error }}
          </p>

          <!-- Submit -->
          <button
            type="submit"
            class="w-full bg-gray-800 text-white py-2 rounded-lg font-medium"
          >
            Login
          </button>
        </form>

        <p class="text-gray-800 text-sm mt-4 text-center">
          Don’t have an account?
          <router-link to="/register" class="text-red-600 underline">
            Register
          </router-link>
        </p>
      </div>
    </section>

    <!-- Right side: Background Image Section -->
    <section
      class="lg:w-3/5 hidden lg:block bg-cover bg-center"
      :style="{ backgroundImage: `url(${bgImage})` }"
    ></section>

  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../Firebase/Firebase";
import bgLogin from "../assets/isuzubg_login2.jpg";

const bgImage = bgLogin;
const identifier = ref("");
const password = ref("");
const showPassword = ref(false);
const error = ref("");
const router = useRouter();

const login = async () => {
  error.value = "";

  try {
    let emailToLogin = identifier.value;

    if (!identifier.value.includes("@")) {
      const q = query(
        collection(db, "users"),
        where("username", "==", identifier.value)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        error.value = "Username not found";
        return;
      }

      const userData = querySnapshot.docs[0].data();

      if (!userData.approved) {
        error.value = "Account is waiting for admin approval";
        return;
      }

      emailToLogin = userData.email;
    }

    await signInWithEmailAndPassword(auth, emailToLogin, password.value);

    router.push("/dashboard");

  } catch (err) {
    if (err.code === "auth/wrong-password") {
      error.value = "Wrong password";
    } else {
      error.value = "Login failed";
    }
  }
};
</script>

<style scoped>
body {
  font-family: "Inter", sans-serif;
}
</style>
