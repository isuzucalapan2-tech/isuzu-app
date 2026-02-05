<template>
  <div class="min-h-screen flex items-center justify-center bg-white">

    <!-- REGISTER FORM -->
    <div class="w-full max-w-md border-2 border-black p-8 rounded-xl">

      <h2 class="text-3xl font-bold text-center mb-6 text-gray-800">
        Register
      </h2>

      <form @submit.prevent="register">

        <!-- First Name -->
        <div class="mb-4">
          <label for="firstName" class="block text-gray-800 mb-1 font-medium">First Name</label>
          <input
            id="firstName"
            v-model="firstName"
            required
            aria-label="First Name"
            :aria-invalid="!!error && error.toLowerCase().includes('name')"
            class="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{'border-red-500': !!error && error.toLowerCase().includes('name')}"
            placeholder="Enter your first name"
            style="text-transform:uppercase;"
            @input="firstName = firstName.toUpperCase()"
          />
        </div>

        <!-- Last Name -->
        <div class="mb-4">
          <label for="lastName" class="block text-gray-800 mb-1 font-medium">Last Name</label>
          <input
            id="lastName"
            v-model="lastName"
            required
            aria-label="Last Name"
            :aria-invalid="!!error && error.toLowerCase().includes('name')"
            class="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{'border-red-500': !!error && error.toLowerCase().includes('name')}"
            placeholder="Enter your last name"
            style="text-transform:uppercase;"
            @input="lastName = lastName.toUpperCase()"
          />
        </div>

        <!-- Middle Initial -->
        <div class="mb-4">
          <label for="middleInitial" class="block text-gray-800 mb-1 font-medium">Middle Initial</label>
          <input
            id="middleInitial"
            v-model="middleInitial"
            aria-label="Middle Initial"
            maxlength="1"
            class="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{'border-red-500': !!error && error.toLowerCase().includes('middle initial')}"
            placeholder="Enter your middle initial"
            style="text-transform:uppercase;"
            @input="middleInitial = middleInitial.toUpperCase()"
          />
        </div>

        <!-- Username -->
        <div class="mb-4">
          <label for="username" class="block text-gray-800 mb-1 font-medium">Username</label>
          <input
            id="username"
            v-model="username"
            required
            aria-label="Username"
            :aria-invalid="!!error && error.toLowerCase().includes('username')"
            class="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{'border-red-500': !!error && error.toLowerCase().includes('username')}"
            placeholder="Enter your username"
          />
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label for="email" class="block text-gray-800 mb-1 font-medium">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            aria-label="Email"
            autocomplete="email"
            :aria-invalid="!!error && error.toLowerCase().includes('email')"
            class="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{'border-red-500': !!error && error.toLowerCase().includes('email')}"
            placeholder="Enter your email"
          />
        </div>

        <!-- Contact Number -->
        <div class="mb-4">
          <label for="contactNumber" class="block text-gray-800 mb-1 font-medium">Contact Number</label>
          <input
            id="contactNumber"
            v-model="contactNumber"
            @input="onContactInput"
            required
            aria-label="Contact Number"
            inputmode="tel"
            autocomplete="tel"
            :aria-invalid="!!error && error.toLowerCase().includes('contact number')"
            class="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{'border-red-500': !!error && error.toLowerCase().includes('contact number')}"
            placeholder="Enter your contact number"
            maxlength="13"
          />
        </div>

        <!-- Gender -->
        <div class="mb-4">
          <label for="gender" class="block text-gray-800 mb-1 font-medium">Gender</label>
          <select
            id="gender"
            v-model="gender"
            required
            aria-label="Gender"
            class="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <!-- Birthday -->
        <div class="mb-4">
          <label for="birthday" class="block text-gray-800 mb-1 font-medium">Birthday</label>
          <input
            id="birthday"
            v-model="birthday"
            type="date"
            required
            aria-label="Birthday"
            :aria-invalid="!!error && error.toLowerCase().includes('birthday')"
            class="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{'border-red-500': !!error && error.toLowerCase().includes('birthday')}"
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
            autocomplete="new-password"
            :aria-invalid="!!error && error.toLowerCase().includes('password')"
            class="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{'border-red-500': !!error && error.toLowerCase().includes('password')}"
            placeholder="Enter password"
          />
        </div>

        <!-- Confirm Password -->
        <div class="mb-4">
          <label for="confirmPassword" class="block text-gray-800 mb-1 font-medium">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            aria-label="Confirm Password"
            autocomplete="new-password"
            :aria-invalid="!!error && error.toLowerCase().includes('password')"
            class="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{'border-red-500': !!error && error.toLowerCase().includes('password')}"
            placeholder="Confirm password"
          />
        </div>

        <!-- Terms and Conditions and Privacy Policy -->
        <div class="mb-4">
          <label class="flex items-center" for="termsAgreed">
            <input
              id="termsAgreed"
              v-model="termsAgreed"
              type="checkbox"
              required
              aria-label="Agree to Terms and Conditions and Privacy Policy"
              class="mr-2 focus:ring-2 focus:ring-blue-500"
            />
            <span>
              I agree to the
              <a href="/terms" target="_blank" class="text-blue-600 underline hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500">Terms and Conditions</a>
              and
              <a href="/privacy" target="_blank" class="text-blue-600 underline hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500">Privacy Policy</a>
            </span>
          </label>
        </div>


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
          Register
        </button>

      </form>

    </div>

    <!-- Approval screen removed: accounts are now active after registration and email verification. -->

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { onAuthStateChanged } from "firebase/auth";
import { updateDoc } from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification
} from "firebase/auth";

import {
  doc,
  setDoc,
  onSnapshot,
  getDoc
} from "firebase/firestore";

import { auth, db } from "../Firebase/Firebase";

const router = useRouter();

const firstName = ref("");
const lastName = ref("");
const middleInitial = ref("");
const username = ref("");
const email = ref("");
const contactNumber = ref("+63");
const gender = ref("");
const birthday = ref("");
const password = ref("");
const confirmPassword = ref("");
const termsAgreed = ref(false);


const error = ref("");
const showVerificationNotice = ref(false);
const resendLoading = ref(false);
const resendMessage = ref("");
const successMessage = ref(""); // New ref for success message

const defaultRole = ref("");
const defaultPosition = ref("");
const defaultPermission = ref("");

const fetchDefaultRoles = async () => {
  try {
    const roleDoc = await getDoc(doc(db, "Role_Access", "isuzu&calapan&staff103"));
    const positionDoc = await getDoc(doc(db, "Position_Access", "isuzu$calapan$position201"));
    const permissionDoc = await getDoc(doc(db, "Permission_Access", "isuzu#calapan#permission305"));

    if (roleDoc.exists()) {
      defaultRole.value = roleDoc.data().roleName;
    }

    if (positionDoc.exists()) {
      defaultPosition.value = positionDoc.data().position;
    }

    if (permissionDoc.exists()) {
      defaultPermission.value = permissionDoc.data().permission;
    }
  } catch (err) {
    console.error("Error fetching default roles:", err);
    // Fallback to hardcoded values if fetch fails
    defaultRole.value = "Staff";
    defaultPosition.value = "Staff";
    defaultPermission.value = "All";
  }
};

onMounted(() => {
  fetchDefaultRoles();
});

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
  // Sanitize all string inputs
  firstName.value = sanitizeInput(firstName.value.trim());
  lastName.value = sanitizeInput(lastName.value.trim());
  middleInitial.value = sanitizeInput(middleInitial.value.trim());
  username.value = sanitizeInput(username.value.trim());
  email.value = sanitizeInput(email.value.trim());
  contactNumber.value = sanitizeInput(contactNumber.value.trim());

  if (!firstName.value || !lastName.value || !username.value || !email.value || !contactNumber.value || !gender.value || !birthday.value || !password.value || !confirmPassword.value) {
    error.value = "All fields are required.";
    return false;
  }

  // Name: only letters, spaces, hyphens, apostrophes
  const nameRegex = /^[A-Za-z\s\-']+$/;
  if (!nameRegex.test(firstName.value) || !nameRegex.test(lastName.value)) {
    error.value = "Names can only contain letters, spaces, hyphens, and apostrophes.";
    return false;
  }
  if (middleInitial.value && !/^[A-Za-z]$/.test(middleInitial.value)) {
    error.value = "Middle initial must be a single letter.";
    return false;
  }

  // Username: 4-20 chars, letters, numbers, underscores only
  const usernameRegex = /^[A-Za-z0-9_]{4,20}$/;
  if (!usernameRegex.test(username.value)) {
    error.value = "Username must be 4-20 characters and contain only letters, numbers, or underscores.";
    return false;
  }

  // Email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    error.value = "Invalid email format.";
    return false;
  }

  // Contact number: must start with +63 and followed by exactly 10 digits (PH format)
  const contactRegex = /^\+63\d{10}$/;
  if (!contactRegex.test(contactNumber.value)) {
    error.value = "Contact number must start with +63 and be followed by 10 digits (e.g., +639171234567).";
    return false;
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

  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match.";
    return false;
  }

  return true;
};

const checkAdminExists = async () => {
  const usernameDoc = await getDoc(doc(db, "Administrator", username.value));
  const emailQuery = await getDoc(doc(db, "Administrator", email.value));

  if (usernameDoc.exists()) {
    error.value = "Username is already taken.";
    return true;
  }

  if (emailQuery.exists()) {
    error.value = "Email is already registered.";
    return true;
  }

  return false;
};

const register = async () => {
  error.value = "";
  resendMessage.value = "";
  showVerificationNotice.value = false;
  successMessage.value = ""; // Reset success message

  if (!validateInputs()) {
    return;
  }

  if (!termsAgreed.value) {
    error.value = "You must agree to the Terms and Conditions.";
    return;
  }

  if (await checkAdminExists()) {
    return;
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = cred.user;

    await updateProfile(user, {
      displayName: username.value
    });

    await setDoc(doc(db, "Administrator", user.uid), {
      username: username.value,
      firstName: firstName.value,
      lastName: lastName.value,
      middleInitial: middleInitial.value,
      contact: contactNumber.value,
      birthday: birthday.value,
      age: calculateAge(birthday.value),
      gender: gender.value,
      email: email.value,
      emailVerified: false,
      createdAt: new Date()
    });

    await setDoc(doc(db, "Terms_and_Agreements", user.uid), {
      agreements: true,
      agreedAt: new Date()
    });

    await setDoc(doc(db, "Roles", user.uid), {
      role: defaultRole.value,//Staff,Admin,Master Admin
      position: defaultPosition.value,// Staff, Operation Manager , Parts Supervisor, Parts Marketing, Parts Admin, Parts Warehouse
      permission: defaultPermission.value, // viewer, editor, creator, deleter, all
      setAt: new Date(),
      updatedAt: new Date(),
      updatedBy: null
    });

    await setDoc(doc(db, "Auth_Logs", user.uid), {
      loginCount: 0,
      loginAttempt: 0,
      lastLogin: null,
      lastChangePass: null,
      timestamp: new Date()
    });

    await sendEmailVerification(user);
    showVerificationNotice.value = false;
    successMessage.value = "Registration successful! Please log in and verify your email to activate your account.";
    setTimeout(() => {
      router.push("/");
    }, 2500);

    onSnapshot(doc(db, "Administrator", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.emailVerified === true) {
          successMessage.value = "Registration complete!";
          setTimeout(() => {
            router.push("/");
          }, 2500);
        }
      }
    });

  } catch (err) {
    // Log error for monitoring/debugging (do not expose sensitive info)
    console.error('Registration error:', err);
    // Show user-friendly error messages
    if (err.code === 'auth/email-already-in-use') {
      error.value = 'This email is already registered.';
    } else if (err.code === 'auth/invalid-email') {
      error.value = 'Invalid email address.';
    } else if (err.code === 'auth/weak-password') {
      error.value = 'Password is too weak.';
    } else if (err.code === 'auth/network-request-failed') {
      error.value = 'Network error. Please check your connection and try again.';
    } else {
      error.value = 'Registration failed. Please try again later.';
    }
  }
};
// Resend verification email
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

const calculateAge = (birthday) => {
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

onAuthStateChanged(auth, async (user) => {
  if (user && user.emailVerified) {
    // Update Firestore document
    await updateDoc(doc(db, "Administrator", user.uid), {
      emailVerified: true
    });
    // Approval logic removed: no admin approval required
    router.push("/");
  }
});

// Prevent user from deleting '+63' prefix in contact number
function onContactInput(e) {
  if (!e.target.value.startsWith('+63')) {
    contactNumber.value = '+63';
  }
}
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
</style>
