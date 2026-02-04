<template>
  <div class="min-h-screen flex items-center justify-center bg-white">

    <!-- REGISTER FORM -->
    <div v-if="!waitingApproval" class="w-full max-w-md border-2 border-black p-8 rounded-xl">

      <h2 class="text-3xl font-bold text-center mb-6 text-gray-800">
        Register
      </h2>

      <form @submit.prevent="register">

        <!-- Username -->
        <div class="mb-4">
          <label class="block text-gray-800 mb-1 font-medium">Username</label>
          <input
            v-model="username"
            required
            class="w-full px-4 py-2 border border-black rounded-lg bg-white"
            placeholder="Enter your username"
          />
        </div>

        <!-- Password -->
        <div class="mb-4">
          <label class="block text-gray-800 mb-1 font-medium">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 border border-black rounded-lg bg-white"
            placeholder="Enter password"
          />
        </div>

        <!-- Confirm Password -->
        <div class="mb-4">
          <label class="block text-gray-800 mb-1 font-medium">Confirm Password</label>
          <input
            v-model="confirmPassword"
            type="password"
            required
            class="w-full px-4 py-2 border border-black rounded-lg bg-white"
            placeholder="Confirm password"
          />
        </div>

        <!-- Error -->
        <p v-if="error" class="text-red-600 text-center mb-4">
          {{ error }}
        </p>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-gray-800 text-white py-2 rounded-lg font-medium"
        >
          Register
        </button>

      </form>

    </div>

    <!-- WAITING APPROVAL SCREEN -->
    <div v-else class="w-full max-w-md border-2 border-black p-8 rounded-xl text-center">

      <h2 class="text-2xl font-bold mb-4 text-gray-800">
        Waiting for Approval
      </h2>

      <p class="text-gray-700">
        Your account is waiting for Super Admin approval.
      </p>

      <p class="text-sm text-gray-500 mt-4">
        This page will update automatically once approved.
      </p>

    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import {
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";

import {
  doc,
  setDoc,
  onSnapshot
} from "firebase/firestore";

import { auth, db } from "../Firebase/Firebase";

const router = useRouter();

const username = ref("");
const password = ref("");
const confirmPassword = ref("");

const error = ref("");
const waitingApproval = ref(false);

const register = async () => {
  error.value = "";

  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match";
    return;
  }

  try {
    // 🔑 Make unique internal email for Firebase Auth
    const uniqueEmail = username.value + "." + Date.now() + "@isuzu.local";

    const cred = await createUserWithEmailAndPassword(auth, uniqueEmail, password.value);
    const user = cred.user;

    await updateProfile(user, {
      displayName: username.value
    });

    // 🔥 Save user to Firestore as pending (approved: false)
    await setDoc(doc(db, "users", user.uid), {
      username: username.value,
      email: uniqueEmail,  // internal email, can ignore on UI
      role: "",
      approved: false,
      createdAt: new Date()
    });

    // Show waiting screen
    waitingApproval.value = true;

    // 🔥 Real-time listener for approval
    onSnapshot(doc(db, "users", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.approved === true) {
          // Redirect after approval
          router.push("/"); // or dashboard
        }
      }
    });

  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      error.value = "Username already exists internally (try again)";
    } else {
      error.value = err.message;
    }
  }
};
</script>

<style scoped>
body {
  font-family: "Inter", sans-serif;
}
</style>
