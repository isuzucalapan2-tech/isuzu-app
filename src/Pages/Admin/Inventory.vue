<template>
  <div v-if="!isLoading" class="min-h-screen bg-gray-100">
    <!-- Topbar -->
    <Topbar />

    <!-- Main Content -->
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-6 text-gray-800 border-l-4 border-red-600 pl-4 flex items-center gap-2">
        <PackageIcon class="w-6 h-6 text-red-600" /> Inventory Management
      </h1>

      <!-- Status Messages -->
      <div v-if="saveSuccess" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
        <CheckCircleIcon class="w-5 h-5" /> {{ saveSuccess }}
      </div>
      <div v-if="saveError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
        <XCircleIcon class="w-5 h-5" /> {{ saveError }}
      </div>

      <!-- Search and Filter Bar -->
      <div class="bg-white shadow-lg rounded-lg p-6 mb-6 border-t-2 border-red-600">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search Box -->
          <div>
            <label class="block text-gray-700 font-medium mb-2 flex items-center gap-1">
              <SearchIcon class="w-5 h-5" /> Search Parts
            </label>
            <input
              v-model="searchQuery"
              type="text"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Search by part name or code..."
            />
          </div>

          <!-- Category Filter -->
          <div>
            <label class="block text-gray-700 font-medium mb-2 flex items-center gap-1">
              <LayersIcon class="w-5 h-5" /> Category
            </label>
            <select
              v-model="filterCategory"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="">All Categories</option>
              <option value="Engine Parts">Engine Parts</option>
              <option value="Transmission">Transmission</option>
              <option value="Suspension">Suspension</option>
              <option value="Electrical">Electrical</option>
              <option value="Body Parts">Body Parts</option>
            </select>
          </div>

          <!-- Stock Status Filter -->
          <div>
            <label class="block text-gray-700 font-medium mb-2 flex items-center gap-1">
              <ActivityIcon class="w-5 h-5" /> Stock Status
            </label>
            <select
              v-model="filterStatus"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>

          <!-- Add Button -->
          <div class="flex items-end">
            <button
              @click="openAddModal"
              :disabled="isSaving"
              class="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <PlusIcon class="w-5 h-5" /> {{ isSaving ? 'Saving...' : 'Add New Part' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white shadow-lg rounded-lg p-4 border-l-2 border-red-600 flex items-center gap-2">
          <BoxIcon class="w-6 h-6 text-gray-600" />
          <div>
            <p class="text-gray-600 text-sm">Total Parts</p>
            <p class="text-3xl font-bold text-gray-800">{{ inventoryItems.length }}</p>
          </div>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-4 border-l-2 border-red-600 flex items-center gap-2">
          <CheckCircle2Icon class="w-6 h-6 text-green-600" />
          <div>
            <p class="text-gray-600 text-sm">In Stock</p>
            <p class="text-3xl font-bold text-green-600">{{ getInStockCount() }}</p>
          </div>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-4 border-l-2 border-red-600 flex items-center gap-2">
          <AlertTriangleIcon class="w-6 h-6 text-yellow-600" />
          <div>
            <p class="text-gray-600 text-sm">Low Stock</p>
            <p class="text-3xl font-bold text-yellow-600">{{ getLowStockCount() }}</p>
          </div>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-4 border-l-2 border-red-600 flex items-center gap-2">
          <XCircleIcon class="w-6 h-6 text-red-600" />
          <div>
            <p class="text-gray-600 text-sm">Out of Stock</p>
            <p class="text-3xl font-bold text-red-600">{{ getOutOfStockCount() }}</p>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white shadow-lg rounded-lg overflow-hidden border-t-2 border-red-600">
        <table class="w-full">
          <thead class="bg-gray-200 border-b-2 border-red-600">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-bold">Part Code</th>
              <th class="px-6 py-3 text-left text-sm font-bold">Part Name</th>
              <th class="px-6 py-3 text-left text-sm font-bold">Category</th>
              <th class="px-6 py-3 text-left text-sm font-bold">Stock Qty</th>
              <th class="px-6 py-3 text-left text-sm font-bold">Min Level</th>
              <th class="px-6 py-3 text-left text-sm font-bold">Status</th>
              <th class="px-6 py-3 text-left text-sm font-bold">Unit Price</th>
              <th class="px-6 py-3 text-left text-sm font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in paginatedInventory" :key="item.id" class="border-b">
              <td class="px-6 py-4 font-medium text-gray-700">{{ item.partCode }}</td>
              <td class="px-6 py-4 font-medium text-gray-800">{{ item.partName }}</td>
              <td class="px-6 py-4">
                <span class="inline-block px-2 py-1 bg-gray-100 rounded-md text-sm text-gray-600">{{ item.category }}</span>
              </td>
              <td class="px-6 py-4 font-bold text-gray-800">{{ item.quantity }}</td>
              <td class="px-6 py-4 text-gray-600">{{ item.minLevel }}</td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-bold inline-block',
                    item.status === 'in-stock'
                      ? 'bg-green-100 text-green-800'
                      : item.status === 'low'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ item.status }}
                </span>
              </td>
              <td class="px-6 py-4 font-semibold text-gray-700">₱{{ item.unitPrice.toFixed(2) }}</td>
              <td class="px-6 py-4 space-x-2 flex">
                <button @click="editPart(item)" :disabled="isSaving" class="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50 flex items-center gap-1">
                  <Edit2Icon class="w-4 h-4" /> Edit
                </button>
                <button @click="deletePart(item.id)" :disabled="isSaving" class="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50 flex items-center gap-1">
                  <Trash2Icon class="w-4 h-4" /> Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div class="bg-white shadow-lg rounded-lg p-4 mt-4 border-l-2 border-red-600">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <span class="text-gray-600 text-sm">Items per page:</span>
            <select
              v-model="itemsPerPage"
              @change="currentPage = 1"
              class="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option v-for="option in itemsPerPageOptions" :key="option" :value="option">{{ option }}</option>
            </select>
          </div>

          <div class="text-gray-600 text-sm">
            Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} - 
            {{ Math.min(currentPage * itemsPerPage, filteredInventory.length) }} 
            of {{ filteredInventory.length }} items
          </div>

          <div class="flex items-center gap-1">
            <button @click="currentPage = 1" :disabled="currentPage === 1" class="px-3 py-1 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">&laquo;</button>
            <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">&lsaquo;</button>
            <button v-for="page in paginationRange" :key="page" @click="currentPage = page" class="px-3 py-1 rounded-lg text-sm font-medium" :class="currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'">{{ page }}</button>
            <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">&rsaquo;</button>
            <button @click="currentPage = totalPages" :disabled="currentPage === totalPages" class="px-3 py-1 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">&raquo;</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { auth, db } from "../../Firebase/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import Topbar from "../../Components/Topbar.vue";

// Lucide icons
import { 
  PackageIcon, SearchIcon, LayersIcon, ActivityIcon, PlusIcon, BoxIcon, 
  CheckCircle2Icon, AlertTriangleIcon, XCircleIcon, Edit2Icon, Trash2Icon, CheckCircleIcon
} from "lucide-vue-next";

// ---------- Your previous state, functions, computed, pagination logic ----------

const router = useRouter();
const isLoading = ref(true);
const isSaving = ref(false);
const saveSuccess = ref("");
const saveError = ref("");
const currentUser = ref(null);

const searchQuery = ref("");
const filterCategory = ref("");
const filterStatus = ref("");
const editingPart = ref(null);

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);
const itemsPerPageOptions = [5, 10, 25, 50, 100];

const sampleInventoryData = [
  { id: 1, partCode: "ISZ-001", partName: "Engine Oil Filter", category: "Engine Parts", quantity: 150, minLevel: 50, unitPrice: 1455, status: "in-stock" },
  { id: 2, partCode: "ISZ-002", partName: "Air Filter", category: "Engine Parts", quantity: 25, minLevel: 50, unitPrice: 894, status: "low" },
  { id: 3, partCode: "ISZ-003", partName: "Transmission Fluid", category: "Transmission", quantity: 80, minLevel: 50, unitPrice: 2575, status: "in-stock" },
  { id: 4, partCode: "ISZ-004", partName: "Brake Pads", category: "Suspension", quantity: 0, minLevel: 30, unitPrice: 4815, status: "out" },
  { id: 5, partCode: "ISZ-005", partName: "Battery", category: "Electrical", quantity: 45, minLevel: 20, unitPrice: 6775, status: "in-stock" },
  { id: 6, partCode: "ISZ-006", partName: "Door Handle", category: "Body Parts", quantity: 110, minLevel: 40, unitPrice: 2015, status: "in-stock" },
  { id: 7, partCode: "ISZ-007", partName: "Spark Plugs", category: "Engine Parts", quantity: 200, minLevel: 100, unitPrice: 727, status: "in-stock" },
  { id: 8, partCode: "ISZ-008", partName: "Alternator", category: "Electrical", quantity: 15, minLevel: 25, unitPrice: 14055, status: "low" },
];

const inventoryItems = ref([...sampleInventoryData]);

// Firestore loading, add, update, delete logic
const loadInventory = async (userId) => {
  try {
    const inventoryRef = collection(db, "users", userId, "inventory");
    const q = query(inventoryRef, orderBy("partCode"));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const firestoreData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      inventoryItems.value = firestoreData;
    } else {
      await saveSampleDataToFirestore(userId);
    }
  } catch (error) {
    console.error(error);
    saveError.value = "Failed to load inventory from database. Using sample data.";
    inventoryItems.value = [...sampleInventoryData];
  }
};

const saveSampleDataToFirestore = async (userId) => {
  try {
    const inventoryRef = collection(db, "users", userId, "inventory");
    for (const item of sampleInventoryData) {
      await addDoc(inventoryRef, { ...item, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    saveSuccess.value = "Sample data saved to database!";
    setTimeout(() => saveSuccess.value = "", 3000);
  } catch (error) { console.error(error); }
};

const addPart = async (partData) => {
  if (!currentUser.value) return;
  isSaving.value = true;
  saveError.value = "";
  try {
    const inventoryRef = collection(db, "users", currentUser.value.uid, "inventory");
    const docRef = await addDoc(inventoryRef, { ...partData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    inventoryItems.value.push({ id: docRef.id, ...partData });
    saveSuccess.value = "Part added successfully!";
    setTimeout(() => saveSuccess.value = "", 3000);
  } catch (error) { console.error(error); saveError.value = "Failed to add part. Please try again."; }
  finally { isSaving.value = false; }
};

const updatePart = async (id, updatedData) => {
  if (!currentUser.value) return;
  isSaving.value = true;
  saveError.value = "";
  try {
    const partRef = doc(db, "users", currentUser.value.uid, "inventory", id);
    await updateDoc(partRef, { ...updatedData, updatedAt: new Date().toISOString() });
    const index = inventoryItems.value.findIndex(i => i.id === id);
    if (index !== -1) inventoryItems.value[index] = { ...inventoryItems.value[index], ...updatedData };
    saveSuccess.value = "Part updated successfully!";
    setTimeout(() => saveSuccess.value = "", 3000);
  } catch (error) { console.error(error); saveError.value = "Failed to update part. Please try again."; }
  finally { isSaving.value = false; }
};

const deletePart = async (id) => {
  if (!currentUser.value) return;
  if (!confirm("Are you sure you want to delete this part?")) return;
  isSaving.value = true; saveError.value = "";
  try {
    const partRef = doc(db, "users", currentUser.value.uid, "inventory", id);
    await deleteDoc(partRef);
    inventoryItems.value = inventoryItems.value.filter(i => i.id !== id);
    saveSuccess.value = "Part deleted successfully!";
    setTimeout(() => saveSuccess.value = "", 3000);
  } catch (error) { console.error(error); saveError.value = "Failed to delete part. Please try again."; }
  finally { isSaving.value = false; }
};

// Computed Properties
const filteredInventory = computed(() => {
  return inventoryItems.value.filter(item => {
    const searchMatch = item.partName.toLowerCase().includes(searchQuery.value.toLowerCase()) || item.partCode.toLowerCase().includes(searchQuery.value.toLowerCase());
    const categoryMatch = filterCategory.value ? item.category === filterCategory.value : true;
    const statusMatch = filterStatus.value ? item.status === filterStatus.value : true;
    return searchMatch && categoryMatch && statusMatch;
  });
});

const totalPages = computed(() => Math.ceil(filteredInventory.value.length / itemsPerPage.value));

const paginatedInventory = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredInventory.value.slice(start, start + itemsPerPage.value);
});

const paginationRange = computed(() => {
  const range = [];
  for (let i = 1; i <= totalPages.value; i++) range.push(i);
  return range;
});

// Stats helpers
const getInStockCount = () => inventoryItems.value.filter(i => i.status === "in-stock").length;
const getLowStockCount = () => inventoryItems.value.filter(i => i.status === "low").length;
const getOutOfStockCount = () => inventoryItems.value.filter(i => i.status === "out").length;

// Auth & load inventory
onMounted(() => {
  onAuthStateChanged(auth, async user => {
    if (user) {
      currentUser.value = user;
      await loadInventory(user.uid);
      isLoading.value = false;
    } else {
      router.push("/login");
    }
  });
});

const openAddModal = () => {
  editingPart.value = null;
  // your modal logic
};

const editPart = (item) => {
  editingPart.value = { ...item };
  // your modal logic
};
</script>
