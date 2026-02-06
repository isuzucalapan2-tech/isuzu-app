<template>
  <div :class="themeClass" class="min-h-screen flex flex-col">

    <!-- Topbar -->
    <Topbar />

    <main class="flex-1 p-6">
      <h1 class="text-3xl font-bold mb-6 border-l-4 border-red-600 pl-4">
        User Management
      </h1>

      <div
        :class="cardClass"
        class="shadow-lg rounded-lg p-6 border-l-2 border-red-600"
      >
        <h2 class="text-xl font-bold mb-4">Administrators</h2>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y border-t-2 border-red-600">
            <thead class="bg-gray-50 border-b-2 border-red-600">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-medium">Name</th>
                <th class="px-6 py-3 text-left text-sm font-medium">Username</th>
                <th class="px-6 py-3 text-left text-sm font-medium">Email</th>
                <th class="px-6 py-3 text-left text-sm font-medium">Role</th>
                <th class="px-6 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="admin in admins"
                :key="admin.id"
                class="hover:bg-gray-100"
              >
                <td class="px-6 py-4 text-sm">
                  {{ admin.firstName }} {{ admin.lastName }}
                </td>

                <td class="px-6 py-4 text-sm">
                  {{ admin.username }}
                </td>

                <td class="px-6 py-4 text-sm">
                  {{ admin.email }}
                </td>

                <td class="px-6 py-4 text-sm">
                  <select
                    v-model="admin.role"
                    class="border rounded px-2 py-1 w-full"
                  >
                    <option disabled value="">Select role</option>
                    <option v-for="role in roles" :key="role" :value="role">
                      {{ role }}
                    </option>
                  </select>
                </td>

                <td class="px-6 py-4 text-sm space-x-2">
                  <button
                    @click="updateAdmin(admin)"
                    class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Save
                  </button>

                  <button
                    @click="deleteAdmin(admin.id)"
                    class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>

              <tr v-if="admins.length === 0">
                <td colspan="5" class="text-center py-6 text-gray-500">
                  No administrator records found
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
import { ref, onMounted } from "vue";
import { db } from "../../Firebase/Firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import Topbar from "../../components/Topbar.vue";

/* =====================
   DATA
===================== */
const admins = ref([]);

const roles = [
  "Operation Manager",
  "Parts Supervisor",
  "Parts Marketing",
  "Parts Admin",
  "Parts Warehouse"
];

/* =====================
   FETCH ADMINISTRATORS
===================== */
const fetchAdmins = async () => {
  const snapshot = await getDocs(collection(db, "Administrator")); // ✅ exact name
  admins.value = snapshot.docs.map(d => ({
    id: d.id,
    role: d.data().role || "", // auto handle missing role
    ...d.data()
  }));
};

/* =====================
   UPDATE ROLE
===================== */
const updateAdmin = async (admin) => {
  await updateDoc(doc(db, "Administrator", admin.id), {
    role: admin.role
  });
  alert("Role updated successfully");
};

/* =====================
   DELETE ADMIN
===================== */
const deleteAdmin = async (id) => {
  if (!confirm("Delete this administrator?")) return;
  await deleteDoc(doc(db, "Administrator", id));
  admins.value = admins.value.filter(a => a.id !== id);
};

/* =====================
   THEME (STATIC)
===================== */
const themeClass = "bg-gray-100 text-gray-900";
const cardClass = "bg-white";

/* =====================
   LIFECYCLE
===================== */
onMounted(fetchAdmins);
</script>
