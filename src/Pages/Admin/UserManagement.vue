<template>
  <div :class="themeClass" class="min-h-screen flex flex-col">

    <!-- Topbar -->
    <Topbar />

    <main class="flex-1 p-6">
      <!-- Page Title -->
      <h1 class="text-3xl font-bold mb-6 border-l-4 border-red-600 pl-4 flex items-center gap-2">
        <Users class="w-7 h-7 text-red-600" />
        User Management
      </h1>

      <div
        :class="cardClass"
        class="shadow-lg rounded-lg p-6 border-l-2 border-red-600"
      >
        <!-- Card Title -->
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
          <Shield class="w-6 h-6 text-red-600" />
          Administrators
        </h2>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y border-t-2 border-red-600">
            <thead class="bg-gray-50 border-b-2 border-red-600">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-medium">
                  <div class="flex items-center gap-2">
                    <User class="w-4 h-4" />
                    Name
                  </div>
                </th>

                <th class="px-6 py-3 text-left text-sm font-medium">
                  <div class="flex items-center gap-2">
                    <AtSign class="w-4 h-4" />
                    Username
                  </div>
                </th>

                <th class="px-6 py-3 text-left text-sm font-medium">
                  <div class="flex items-center gap-2">
                    <Mail class="w-4 h-4" />
                    Email
                  </div>
                </th>

                <th class="px-6 py-3 text-left text-sm font-medium">
                  <div class="flex items-center gap-2">
                    <Briefcase class="w-4 h-4" />
                    Role
                  </div>
                </th>

                <th class="px-6 py-3 text-left text-sm font-medium">
                  <div class="flex items-center gap-2">
                    <Settings class="w-4 h-4" />
                    Actions
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="admin in admins"
                :key="admin.id"
                class="hover:bg-gray-100 transition"
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

                <td class="px-6 py-4 text-sm flex gap-2">
                  <button
                    @click="updateAdmin(admin)"
                    class="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    <Save class="w-4 h-4" />
                    Save
                  </button>

                  <button
                    @click="deleteAdmin(admin.id)"
                    class="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    <Trash2 class="w-4 h-4" />
                    Delete
                  </button>
                </td>
              </tr>

              <tr v-if="admins.length === 0">
                <td colspan="5" class="text-center py-6 text-gray-500">
                  <div class="flex justify-center items-center gap-2">
                    <AlertCircle class="w-5 h-5" />
                    No administrator records found
                  </div>
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

/* 🔥 Lucide Icons */
import {
  Users,
  User,
  Shield,
  Mail,
  AtSign,
  Briefcase,
  Settings,
  Save,
  Trash2,
  AlertCircle
} from "lucide-vue-next";

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
  const snapshot = await getDocs(collection(db, "Administrator"));
  admins.value = snapshot.docs.map(d => ({
    id: d.id,
    role: d.data().role || "",
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
   THEME
===================== */
const themeClass = "bg-gray-100 text-gray-900";
const cardClass = "bg-white";

/* =====================
   LIFECYCLE
===================== */
onMounted(fetchAdmins);
</script>
