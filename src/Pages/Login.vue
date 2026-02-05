
<template>
  <div class="min-h-screen flex items-center justify-center bg-white">
    <div class="w-full max-w-md border-2 border-black p-8 rounded-xl">
      <h2 class="text-3xl font-bold text-center mb-6 text-gray-800">
        Login
      </h2>
      <form @submit.prevent="login">
        <!-- Username or Email -->
        <div class="mb-4">
          <label for="identifier" class="block text-gray-800 mb-1 font-medium">Username or Email</label>
          <input
            id="identifier"
            v-model="identifier"
            required
            aria-label="Username or Email"
            :aria-invalid="!!error && error.toLowerCase().includes('username') || error.toLowerCase().includes('email')"
            class="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{'border-red-500': !!error && (error.toLowerCase().includes('username') || error.toLowerCase().includes('email'))}"
            placeholder="Enter your username or email"
          />
        </div>
        <!-- Password -->
        <div class="mb-4">
          <label for="password" class="block text-gray-800 mb-1 font-medium">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            aria-label="Password"
            autocomplete="current-password"
            :aria-invalid="!!error && error.toLowerCase().includes('password')"
            class="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{'border-red-500': !!error && error.toLowerCase().includes('password')}"
            placeholder="Enter your password"
          />
        </div>
        <!-- Session Expired Message -->
        <p v-if="$route.query.session === 'expired'" class="text-yellow-700 text-sm mb-4 text-center font-medium">
          Your session has expired. Please log in again.
        </p>
        <!-- Error -->
        <p v-if="error" class="text-red-600 text-center mb-4">
          {{ error }}
        </p>
        <!-- Success Message -->
        <p v-if="successMessage" class="text-green-700 text-center mb-4 font-medium">
          {{ successMessage }}
        </p>
        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-gray-800 text-white py-2 rounded-lg font-medium"
        >
          Login
        </button>
      </form>
      <!-- Resend Verification Email -->
      <div v-if="showVerificationNotice" class="mt-4">
        <p class="text-red-600 text-sm mb-2 text-center">
          Your email is not verified. Please verify your email to continue.
        </p>
        <button
          @click="resendVerificationEmail"
          :disabled="resendLoading"
          class="w-full bg-gray-300 text-gray-800 py-2 rounded-lg font-medium flex items-center justify-center"
        >
          <span v-if="resendLoading" class="loader"></span>
          <span v-else>Resend Verification Email</span>
        </button>
        <p v-if="resendMessage" class="text-center text-sm mt-2">
          {{ resendMessage }}
        </p>
      </div>
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
import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../Firebase/Firebase";

const identifier = ref("");
const password = ref("");
const error = ref("");
const successMessage = ref("");
const resendLoading = ref(false);
const resendMessage = ref("");
const showVerificationNotice = ref(false);
const router = useRouter();

// Simple sanitization to escape HTML special characters
function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>'"`=\/]/g, function (s) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
      '`': '&#96;',
      '=': '&#61;',
      '/': '&#47;'
    })[s];
  });
}

const validateInputs = () => {
  identifier.value = sanitizeInput(identifier.value.trim());
  password.value = sanitizeInput(password.value.trim());

  if (!identifier.value || !password.value) {
    error.value = "All fields are required.";
    return false;
  }

  // Email or username
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernameRegex = /^[A-Za-z0-9_]{4,20}$/;
  if (!identifier.value.includes("@")) {
    if (!usernameRegex.test(identifier.value)) {
      error.value = "Username must be 4-20 characters and contain only letters, numbers, or underscores.";
      return false;
    }
  } else {
    if (!emailRegex.test(identifier.value)) {
      error.value = "Invalid email format.";
      return false;
    }
  }

  // Password policy: min 8 chars, uppercase, lowercase, number, special char
  const passwordPolicy = {
    minLength: 8,
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /[0-9]/,
    special: /[!@#$%^&*(),.?":{}|<>]/
  };
  if (password.value.length < passwordPolicy.minLength) {
    error.value = "Password must be at least 8 characters long.";
    return false;
  }
  if (!passwordPolicy.uppercase.test(password.value)) {
    error.value = "Password must contain at least one uppercase letter.";
    return false;
  }
  if (!passwordPolicy.lowercase.test(password.value)) {
    error.value = "Password must contain at least one lowercase letter.";
    return false;
  }
  if (!passwordPolicy.number.test(password.value)) {
    error.value = "Password must contain at least one number.";
    return false;
  }
  if (!passwordPolicy.special.test(password.value)) {
    error.value = "Password must contain at least one special character.";
    return false;
  }
  return true;
};

const login = async () => {
  error.value = "";
  successMessage.value = "";
  showVerificationNotice.value = false;
  resendMessage.value = "";

  if (!validateInputs()) {
    return;
  }

  try {
    let emailToLogin = identifier.value;
    let userUid = null;
    let userData = null;

    // If NOT email → treat as username
    if (!identifier.value.includes("@")) {
      // Check username in Administrator collection
      const q = query(collection(db, "Administrator"), where("username", "==", identifier.value));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        error.value = "Username not found.";
        return;
      }
      userData = querySnapshot.docs[0].data();
      userUid = querySnapshot.docs[0].id;
      emailToLogin = userData.email;
    } else {
      // Email login: get user by email in Administrator collection
      const q = query(collection(db, "Administrator"), where("email", "==", identifier.value));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        error.value = "Email not found.";
        return;
      }
      userData = querySnapshot.docs[0].data();
      userUid = querySnapshot.docs[0].id;
    }

    // Firebase login
    const cred = await signInWithEmailAndPassword(auth, emailToLogin, password.value);
    const user = cred.user;

    // Check email verification
    if (user.emailVerified) {
      // Update Firestore emailVerified field if not already true
      const adminDoc = await getDoc(doc(db, "Administrator", user.uid));
      if (adminDoc.exists() && !adminDoc.data().emailVerified) {
        await updateDoc(doc(db, "Administrator", user.uid), {
          emailVerified: true
        });
      }
      successMessage.value = "Login successful! Redirecting...";
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } else {
      showVerificationNotice.value = true;
      error.value = "Your email is not verified. Please check your inbox or click the button below to resend verification.";
    }
  } catch (err) {
    // Log error for monitoring/debugging (do not expose sensitive info)
    console.error('Login error:', err);
    // Show user-friendly error messages
    if (err.code === 'auth/wrong-password') {
      error.value = 'Wrong password.';
    } else if (err.code === 'auth/user-not-found') {
      error.value = 'Account not found.';
    } else if (err.code === 'auth/too-many-requests') {
      error.value = 'Too many failed attempts. Please try again later.';
    } else if (err.code === 'auth/network-request-failed') {
      error.value = 'Network error. Please check your connection and try again.';
    } else {
      error.value = 'Login failed. Please try again.';
    }
  }
};

const resendVerificationEmail = async () => {
  resendLoading.value = true;
  resendMessage.value = "";
  try {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
      resendMessage.value = "Verification email resent. Please check your inbox or spam folder.";
    } else {
      resendMessage.value = "User not found. Please log in again.";
    }
  } catch (err) {
    resendMessage.value = err.message;
  } finally {
    resendLoading.value = false;
  }
};
</script>


<style scoped>
body {
  font-family: "Inter", sans-serif;
}
input:focus, select:focus, textarea:focus, button:focus {
  outline: none;
  box-shadow: 0 0 0 2px #2563eb;
  border-color: #2563eb;
}
.border-red-500 {
  border-color: #ef4444 !important;
}
.loader {
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  border-top: 2px solid #ffffff;
  width: 16px;
  height: 16px;
  animation: spin 0.6s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
