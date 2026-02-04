<template>
  <div class="flex min-h-screen bg-white">

    <!-- Sidebar -->
    <Sidebar />

    <!-- Content -->
    <div class="flex-1 p-8">

      <h1 class="text-2xl font-bold mb-6 text-gray-800">
        User Approval
      </h1>

      <div class="border-2 border-black rounded-xl overflow-hidden">

        <!-- Users Table -->
        <table class="w-full text-left">
          <thead class="border-b-2 border-black bg-gray-100">
            <tr>
              <th class="p-3">Username</th>
              <th class="p-3">Email</th>
              <th class="p-3">Role</th>
              <th class="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            <!-- Pending Users -->
            <tr
              v-for="user in pendingUsers"
              :key="user.id"
              class="border-b border-gray-300"
            >
              <td class="p-3">{{ user.username || "N/A" }}</td>
              <td class="p-3">{{ user.email || "N/A" }}</td>

              <!-- Role Selector -->
              <td class="p-3">
                <select
                  v-model="user.selectedRole"
                  class="border border-black px-2 py-1 rounded w-full"
                >
                  <option disabled value="">Select Role</option>
                  <option>Parts Supervisor</option>
                  <option>Parts Marketing</option>
                  <option>Parts Admin</option>
                  <option>Parts Warehouse</option>
                </select>
              </td>

              <!-- Approve Button -->
              <td class="p-3">
                <button
                  @click="approveUser(user)"
                  class="bg-gray-800 text-white px-4 py-1 rounded"
                >
                  Approve
                </button>
              </td>
            </tr>

            <!-- No Pending Users -->
            <tr v-if="pendingUsers.length === 0">
              <td colspan="4" class="text-center p-6 text-gray-500">
                No pending users
              </td>
            </tr>
          </tbody>
        </table>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Sidebar from "../../Components/Sidebar.vue";

import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc
} from "firebase/firestore";

import { db } from "../../Firebase/Firebase";

const pendingUsers = ref([]);

// ✅ Load Pending Users Only
const loadPendingUsers = () => {
  try {
    const q = query(
      collection(db, "users"),
      where("approved", "==", false) // only false
    );

    // Real-time listener
    onSnapshot(q, (snapshot) => {
      pendingUsers.value = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          username: data.username || "N/A",
          email: data.email || "N/A",
          role: data.role || "",
          approved: data.approved || false,
          selectedRole: "" // temporary role selection
        };
      });

      console.log("Pending users:", pendingUsers.value); // debug
    });
  } catch (err) {
    console.error("Firestore error:", err);
  }
};

// ✅ Approve User
const approveUser = async (user) => {
  if (!user.selectedRole) {
    alert("Please select role first");
    return;
  }

  try {
    const userRef = doc(db, "users", user.id);

    await updateDoc(userRef, {
      approved: true,
      role: user.selectedRole
    });

    // Remove user instantly from the table
    pendingUsers.value = pendingUsers.value.filter(u => u.id !== user.id);

  } catch (error) {
    console.error("Error approving user:", error);
  }
};

onMounted(() => {
  loadPendingUsers();
});
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>
