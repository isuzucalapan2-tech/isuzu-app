<template>
  <div class="min-h-screen flex items-center justify-center bg-white">
    <div class="w-full max-w-md border-2 border-black p-8 rounded-xl">
      <h2 class="text-3xl font-bold text-center mb-6 text-gray-800">
        Login
      </h2>

      <form @submit.prevent="login">
        <!-- Username or Email -->
        <div class="mb-4">
          <label class="block text-gray-800 mb-1 font-medium">
            Username or Email
          </label>
          <input
            v-model="identifier"
            type="text"
            required
            class="w-full px-4 py-2 border border-black rounded-lg focus:outline-none bg-white text-gray-800"
            placeholder="Enter username or email"
          />
        </div>

        <!-- Password -->
        <div class="mb-4">
          <label class="block text-gray-800 mb-1 font-medium">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 border border-black rounded-lg focus:outline-none bg-white text-gray-800"
            placeholder="Enter your password"
          />
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

      <p class="text-center text-sm text-gray-800 mt-4">
        Don’t have an account?
        <router-link to="/register" class="text-red-600 underline">
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
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../Firebase/Firebase";

const identifier = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();

const login = async () => {
  error.value = "";

  try {
    let emailToLogin = identifier.value;

    // If NOT email → treat as username
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

      // Check approval
      if (!userData.approved) {
        error.value = "Account is waiting for admin approval";
        return;
      }

      emailToLogin = userData.email;
    }

    // Firebase login
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
