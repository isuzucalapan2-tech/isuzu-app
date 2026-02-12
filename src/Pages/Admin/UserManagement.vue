 <template>
  <!-- 🔧 LOADING -->
  <div v-if="isLoading" class="min-h-screen flex items-center justify-center">
    <Loaders />
  </div>

  <!-- MAIN CONTENT -->
  <div v-else :class="themeClass" :style="themeStyle" class="min-h-screen flex flex-col">

    <!-- Topbar -->
    <!-- <Topbar /> -->

    <main class="flex-1 p-6">
      <!-- Page Title -->
      <h1 :class="textClass"
        class="text-3xl font-bold mb-6 border-l-4 border-red-600 pl-4 flex items-center gap-2">
        <Users class="w-7 h-7 text-red-600" />
        User Management
      </h1>

      <div
        :class="cardClass"
        :style="cardStyle"
        class="shadow-lg rounded-lg p-6 border-l-2 border-red-600 hover:shadow-xl transition-all duration-300"
      >


        <!-- Card Title -->
        <h2 :class="textClass" class="text-xl font-bold mb-4 flex items-center gap-2">
          <Shield class="w-6 h-6 text-red-600" />
          Administrators
        </h2>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y border-t-2 border-red-600">
            <thead :class="tableHeaderClass" class="border-b-2 border-red-600">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-medium">
                  <div class="flex items-center gap-2">
                    <User class="w-4 h-4" /> Name
                  </div>
                </th>

                <th class="px-6 py-3 text-left text-sm font-medium">
                  <div class="flex items-center gap-2">
                    <AtSign class="w-4 h-4" /> Username
                  </div>
                </th>

                <th class="px-6 py-3 text-left text-sm font-medium">
                  <div class="flex items-center gap-2">
                    <Mail class="w-4 h-4" /> Email
                  </div>
                </th>

                <th class="px-6 py-3 text-left text-sm font-medium">
                  <div class="flex items-center gap-2">
                    <Phone class="w-4 h-4" /> Contact
                  </div>
                </th>

                <th class="px-6 py-3 text-left text-sm font-medium">
                  <div class="flex items-center gap-2">
                    <Calendar class="w-4 h-4" /> Birthday
                  </div>
                </th>

                <th class="px-6 py-3 text-left text-sm font-medium">
                  <div class="flex items-center gap-2">
                    <UserCircle class="w-4 h-4" /> Gender
                  </div>
                </th>

                <th class="px-6 py-3 text-left text-sm font-medium">
                  <div class="flex items-center gap-2">
                    <Clock class="w-4 h-4" /> Joined
                  </div>
                </th>

                <th class="px-6 py-3 text-left text-sm font-medium">
                  <div class="flex items-center gap-2">
                    <FileText class="w-4 h-4" /> Logs
                  </div>
                </th>

                <th class="px-6 py-3 text-left text-sm font-medium">
                  <div class="flex items-center gap-2">
                    <Briefcase class="w-4 h-4" /> Role
                  </div>
                </th>

                <th class="px-6 py-3 text-left text-sm font-medium">
                  <div class="flex items-center gap-2">
                    <Settings class="w-4 h-4" /> Actions
                  </div>
                </th>

              </tr>
            </thead>

            <tbody>
            <tr
              v-for="admin in paginatedAdmins"
              :key="admin.id"
              :class="tableRowClass"
              class="transition duration-200 hover:shadow-md"
            >

                <td :class="textClass" class="px-6 py-4 text-sm">
                  {{ admin.firstName }} {{ admin.lastName }}
                </td>

                <td :class="textClass" class="px-6 py-4 text-sm">
                  {{ admin.username }}
                </td>

                <td :class="textClass" class="px-6 py-4 text-sm">
                  {{ admin.email }}
                </td>

                <td :class="textClass" class="px-6 py-4 text-sm">
                  {{ admin.contact || 'N/A' }}
                </td>

                <td :class="textClass" class="px-6 py-4 text-sm">
                  {{ formatDate(admin.birthday) }}
                </td>

                <td :class="textClass" class="px-6 py-4 text-sm">
                  <span class="px-2 py-1 rounded-full text-xs font-medium" :class="getGenderClass(admin.gender)">
                    {{ admin.gender || 'N/A' }}
                  </span>
                </td>

                <td :class="textClass" class="px-6 py-4 text-sm">
                  {{ formatDate(admin.createdAt) }}
                </td>

                <td :class="textClass" class="px-6 py-4 text-sm">
                  <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">
                    {{ admin.logsCount || 0 }}
                  </span>
                </td>

                <td class="px-6 py-4 text-sm">

                  <select v-model="admin.role" class="border rounded px-2 py-1 w-full">
                    <option disabled value="">Select role</option>
                    <option v-for="role in roles" :key="role" :value="role">
                      {{ role }}
                    </option>
                  </select>
                </td>

                <td class="px-6 py-4 text-sm flex gap-2">
                  <button
                    @click="updateAdmin(admin)"
                    class="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <Save class="w-4 h-4" /> Save
                  </button>

                  <button
                    @click="deleteAdmin(admin.id)"
                    class="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <Trash2 class="w-4 h-4" /> Delete
                  </button>
                </td>

              </tr>

              <tr v-if="paginatedAdmins.length === 0">
                <td colspan="10" :class="subTextClass" class="text-center py-6">

                  <div class="flex justify-center items-center gap-2">
                    <AlertCircle class="w-5 h-5" />
                    No administrator records found
                  </div>
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="admins.length > 0" class="mt-4 flex items-center justify-between border-t pt-4" :class="isDarkMode ? 'border-gray-600' : 'border-gray-200'">
          <div :class="subTextClass" class="text-sm">
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, admins.length) }} of {{ admins.length }} administrators
          </div>
          <div class="flex items-center gap-2">
            <button 
              @click="currentPage--" 
              :disabled="currentPage === 1"
              class="flex items-center gap-1 px-3 py-1.5 rounded border text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
              :class="isDarkMode ? 'border-gray-600 hover:bg-gray-700 text-white' : 'border-gray-300 hover:bg-gray-100 text-gray-700'"
            >
              <ChevronLeft class="w-4 h-4" /> Prev
            </button>
            <span :class="textClass" class="text-sm font-medium px-3 py-1.5">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button 
              @click="currentPage++" 
              :disabled="currentPage === totalPages"
              class="flex items-center gap-1 px-3 py-1.5 rounded border text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
              :class="isDarkMode ? 'border-gray-600 hover:bg-gray-700 text-white' : 'border-gray-300 hover:bg-gray-100 text-gray-700'"
            >
              Next <ChevronRight class="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { db } from "../../Firebase/Firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

//import Topbar from "../../components/Topbar.vue";
/* 🔧 ADDED */
import Loaders from "../../components/Loaders.vue";

/* ICONS */
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
  AlertCircle,
  Phone,
  Calendar,
  UserCircle,
  Clock,
  FileText,
  ChevronLeft,
  ChevronRight
} from "lucide-vue-next";


/* =====================
   DATA
===================== */
const admins = ref([]);
const isLoading = ref(true);
const currentPage = ref(1);
const itemsPerPage = ref(5);


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
  
  // Fetch logs count for each admin
  const adminsWithLogs = await Promise.all(
    snapshot.docs.map(async (d) => {
      const adminData = d.data();
      
      // Get logs count from logs collection
      let logsCount = 0;
      try {
        const logsSnapshot = await getDocs(collection(db, "Administrator", d.id, "logs"));
        logsCount = logsSnapshot.size;
      } catch (e) {
        logsCount = 0;
      }
      
      return {
        id: d.id,
        role: adminData.role || "",
        logsCount: logsCount,
        ...adminData
      };
    })
  );
  
  admins.value = adminsWithLogs;
  isLoading.value = false;
};

/* =====================
   PAGINATION
===================== */
const totalPages = computed(() => Math.ceil(admins.value.length / itemsPerPage.value) || 1);

const paginatedAdmins = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return admins.value.slice(start, start + itemsPerPage.value);
});


/* =====================
   UTILITY FUNCTIONS
===================== */
const formatDate = (dateValue) => {
  if (!dateValue) return 'N/A';
  // Handle Firestore Timestamp or string date
  const date = dateValue.toDate ? dateValue.toDate() : new Date(dateValue);
  if (isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const getGenderClass = (gender) => {
  const classes = {
    'Male': 'bg-blue-100 text-blue-800',
    'Female': 'bg-pink-100 text-pink-800',
    'Other': 'bg-purple-100 text-purple-800'
  };
  return classes[gender] || 'bg-gray-100 text-gray-800';
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
const isDarkMode = computed(() =>
  document.documentElement.classList.contains("dark")
);

const themeClass = computed(() =>
  isDarkMode.value ? "text-white" : "bg-gray-100 text-gray-900"
);

const themeStyle = computed(() =>
  isDarkMode.value ? { backgroundColor: "#232323" } : {}
);

const cardClass = computed(() =>
  isDarkMode.value ? "text-white" : "bg-white text-gray-900"
);

const cardStyle = computed(() =>
  isDarkMode.value ? { backgroundColor: "#2a2a2a" } : {}
);

const textClass = computed(() =>
  isDarkMode.value ? "text-white" : "text-gray-900"
);

const subTextClass = computed(() =>
  isDarkMode.value ? "text-gray-300" : "text-gray-500"
);

const tableHeaderClass = computed(() =>
  isDarkMode.value ? "bg-gray-700 text-white" : "bg-gray-50 text-gray-900"
);

const tableRowClass = computed(() =>
  isDarkMode.value ? "hover:bg-gray-700" : "hover:bg-gray-100"
);

/* =====================
   LIFECYCLE
===================== */
onMounted(fetchAdmins);
</script>
