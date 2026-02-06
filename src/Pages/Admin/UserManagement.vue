<template>
  <div :class="themeClass" class="min-h-screen flex flex-col">

    <!-- Topbar -->
    <Topbar />

    <main class="flex-1 p-6">
      <h1 class="text-3xl font-bold mb-6 border-l-4 border-red-600 pl-4">User Management</h1>

      <!-- Users Card -->
      <div :class="cardClass" class="shadow-lg rounded-lg p-6 transition-colors duration-300 border-l-2 border-red-600 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">

        <h2 class="text-xl font-bold mb-4" :class="textClass">All Users</h2>

        <!-- Users Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y transition-colors duration-300 border-t-2 border-red-600" :class="tableClass">
            <thead :class="theadClass" class="border-b-2 border-red-600">

              <tr>
                <th class="px-6 py-3 text-left text-sm font-medium">Username</th>
                <th class="px-6 py-3 text-left text-sm font-medium">Email</th>
                <th class="px-6 py-3 text-left text-sm font-medium">Role</th>
                <th class="px-6 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody :class="tbodyClass">
              <tr v-for="(user, index) in users" :key="user.id" :class="rowClass" class="hover:bg-red-50 hover:shadow-md transition-all duration-200">
                <td class="px-6 py-4 text-sm">{{ user.username || user.name }}</td>
                <td class="px-6 py-4 text-sm">{{ user.email }}</td>
                <td class="px-6 py-4 text-sm">
                  <select v-model="user.role" :class="inputClass" class="hover:border-red-400 hover:shadow-sm transition-all duration-200">
                    <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
                  </select>
                </td>
                <td class="px-6 py-4 text-sm space-x-2">
                  <button
                    @click="updateUser(user)"
                    class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Save
                  </button>
                  <button
                    @click="deleteUser(user.id)"
                    class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { db } from "../../Firebase/Firebase";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import Topbar from "../../components/Topbar.vue";

// Users array
const users = ref([]);

// Roles
const roles = [
  "Operation Manager",
  "Parts Supervisor",
  "Parts Marketing",
  "Parts Admin",
  "Parts Warehouse"
];

// Fetch users from Firestore
const fetchUsers = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));
  users.value = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
};

// Update user role
const updateUser = async (user) => {
  try {
    const userRef = doc(db, "users", user.id);
    await updateDoc(userRef, { role: user.role });
    alert("User role updated!");
  } catch (err) {
    console.error(err);
    alert("Failed to update user.");
  }
};

// Delete user
const deleteUser = async (id) => {
  if (!confirm("Are you sure you want to delete this user?")) return;
  try {
    await deleteDoc(doc(db, "users", id));
    users.value = users.value.filter(u => u.id !== id);
    alert("User deleted!");
  } catch (err) {
    console.error(err);
    alert("Failed to delete user.");
  }
};

// Theme handling (light/dark)
const settings = ref({ general: { theme: "light" } });

// Dynamic classes for theme
const themeClass = computed(() => settings.value.general.theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900");
const cardClass = computed(() => settings.value.general.theme === "dark" ? "bg-gray-800" : "bg-white");
const textClass = computed(() => settings.value.general.theme === "dark" ? "text-gray-100" : "text-gray-900");
const tableClass = computed(() => settings.value.general.theme === "dark" ? "divide-gray-700" : "divide-gray-200");
const theadClass = computed(() => settings.value.general.theme === "dark" ? "bg-gray-700 text-gray-100" : "bg-gray-50 text-gray-900");
const tbodyClass = computed(() => settings.value.general.theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900");
const rowClass = computed(() => settings.value.general.theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100");
const inputClass = computed(() => settings.value.general.theme === "dark" ? "w-full border rounded px-2 py-1 bg-gray-700 text-gray-100" : "w-full border rounded px-2 py-1 bg-white text-gray-900");

// Fetch users on mount
onMounted(() => fetchUsers());
</script>

<style scoped>
body {
  font-family: "Inter", sans-serif;
}
table input, table select {
  transition: all 0.2s;
}
</style>
