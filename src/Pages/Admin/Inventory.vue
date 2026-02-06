<template>
  <div v-if="!isLoading" class="min-h-screen bg-gray-100">
    <!-- Topbar -->
    <Topbar />

    <!-- Main Content -->
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">Inventory Management</h1>

      <!-- Search and Filter Bar -->
      <div class="bg-white shadow-lg rounded-lg p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">

          <!-- Search Box -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">Search Parts</label>
            <input
              v-model="searchQuery"
              type="text"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 hover:border-blue-400 hover:shadow-md transition-all duration-200"
              placeholder="Search by part name or code..."
            />

          </div>

          <!-- Category Filter -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">Category</label>
            <select
              v-model="filterCategory"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 hover:border-blue-400 hover:bg-gray-50 hover:shadow-md transition-all duration-200 cursor-pointer"
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
            <label class="block text-gray-700 font-medium mb-2">Stock Status</label>
            <select
              v-model="filterStatus"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 hover:border-blue-400 hover:bg-gray-50 hover:shadow-md transition-all duration-200 cursor-pointer"
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
              @click="showAddPartModal = true"
              class="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
            >
              + Add New Part
            </button>
          </div>

        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
          <p class="text-gray-600 text-sm">Total Parts</p>
          <p class="text-3xl font-bold text-gray-800">{{ inventoryItems.length }}</p>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
          <p class="text-gray-600 text-sm">In Stock</p>
          <p class="text-3xl font-bold text-green-600">{{ getInStockCount() }}</p>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
          <p class="text-gray-600 text-sm">Low Stock</p>
          <p class="text-3xl font-bold text-yellow-600">{{ getLowStockCount() }}</p>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
          <p class="text-gray-600 text-sm">Out of Stock</p>
          <p class="text-3xl font-bold text-red-600">{{ getOutOfStockCount() }}</p>
        </div>
      </div>


      <!-- Table -->
      <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-200">
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
            <tr
              v-for="item in paginatedInventory"
              :key="item.id"
              class="border-b hover:bg-blue-50 hover:shadow-md transition-all duration-200"
            >

              <td class="px-6 py-4 font-medium text-gray-700">{{ item.partCode }}</td>
              <td class="px-6 py-4 font-medium text-gray-800">{{ item.partName }}</td>
              <td class="px-6 py-4">
                <span class="inline-block px-2 py-1 bg-gray-100 rounded-md text-sm text-gray-600 hover:bg-gray-200 transition-colors duration-200">
                  {{ item.category }}
                </span>
              </td>
              <td class="px-6 py-4 font-bold text-gray-800">{{ item.quantity }}</td>
              <td class="px-6 py-4 text-gray-600">{{ item.minLevel }}</td>

              <td class="px-6 py-4">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-bold transition-transform duration-200 hover:scale-110 inline-block',
                    item.status === 'in-stock'
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : item.status === 'low'
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  ]"
                >
                  {{ item.status }}
                </span>
              </td>

              <td class="px-6 py-4 font-semibold text-gray-700">₱{{ item.unitPrice.toFixed(2) }}</td>

              <td class="px-6 py-4 space-x-2">
                <button
                  @click="editPart(item)"
                  class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  Edit
                </button>

                <button
                  @click="deletePart(item.id)"
                  class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>

        </table>
      </div>

      <!-- Pagination Controls -->
      <div class="bg-white shadow-lg rounded-lg p-4 mt-4">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <!-- Items per page selector -->
          <div class="flex items-center gap-2">
            <span class="text-gray-600 text-sm">Items per page:</span>
            <select
              v-model="itemsPerPage"
              @change="currentPage = 1"
              class="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 hover:border-blue-400 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
            >
              <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>


          <!-- Showing info -->
          <div class="text-gray-600 text-sm">
            Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} - 
            {{ Math.min(currentPage * itemsPerPage, filteredInventory.length) }} 
            of {{ filteredInventory.length }} items
          </div>

          <!-- Page navigation -->
          <div class="flex items-center gap-1">
            <!-- First page -->
            <button
              @click="currentPage = 1"
              :disabled="currentPage === 1"
              class="px-3 py-1 rounded-lg text-sm font-medium transition"
              :class="currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            >
              &laquo;
            </button>

            <!-- Previous page -->
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-1 rounded-lg text-sm font-medium transition"
              :class="currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            >
              &lsaquo;
            </button>

            <!-- Page numbers -->
            <button
              v-for="page in paginationRange"
              :key="page"
              @click="currentPage = page"
              class="px-3 py-1 rounded-lg text-sm font-medium transition"
              :class="currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            >
              {{ page }}
            </button>

            <!-- Next page -->
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 rounded-lg text-sm font-medium transition"
              :class="currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            >
              &rsaquo;
            </button>

            <!-- Last page -->
            <button
              @click="currentPage = totalPages"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 rounded-lg text-sm font-medium transition"
              :class="currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            >
              &raquo;
            </button>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { auth } from "../../Firebase/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import Topbar from "../../Components/Topbar.vue";

const router = useRouter();
const isLoading = ref(true);

const searchQuery = ref("");
const filterCategory = ref("");
const filterStatus = ref("");
const showAddPartModal = ref(false);
const editingPart = ref(null);

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(10);
const itemsPerPageOptions = [5, 10, 25, 50, 100];


const inventoryItems = ref([
  {
    id: 1,
    partCode: "ISZ-001",
    partName: "Engine Oil Filter",
    category: "Engine Parts",
    quantity: 150,
    minLevel: 50,
    unitPrice: 1455,
    status: "in-stock",
  },
]);

onMounted(() => {
  // Load and apply saved theme from localStorage
  const savedTheme = localStorage.getItem("appTheme");
  if (savedTheme) {
    applyTheme(savedTheme);
  }

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    isLoading.value = false;
    if (!user) {
      router.push("/");
    }
  });
  return () => unsubscribe();
});

// Apply theme function
const applyTheme = (theme) => {
  const htmlElement = document.documentElement;
  htmlElement.classList.remove("dark", "light");
  if (theme === "dark") {
    htmlElement.classList.add("dark");
  } else if (theme === "light") {
    htmlElement.classList.add("light");
  }
};

const filteredInventory = computed(() => {
  return inventoryItems.value.filter((item) => {
    return (
      item.partName.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
      (filterCategory.value === "" || item.category === filterCategory.value) &&
      (filterStatus.value === "" || item.status === filterStatus.value)
    );
  });
});

// Paginated inventory items
const paginatedInventory = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredInventory.value.slice(start, end);
});

// Total pages
const totalPages = computed(() => {
  return Math.ceil(filteredInventory.value.length / itemsPerPage.value);
});

// Pagination range (show max 5 page buttons)
const paginationRange = computed(() => {
  const range = [];
  const maxButtons = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxButtons / 2));
  let end = Math.min(totalPages.value, start + maxButtons - 1);
  
  if (end - start + 1 < maxButtons) {
    start = Math.max(1, end - maxButtons + 1);
  }
  
  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  return range;
});


const getInStockCount = () =>
  inventoryItems.value.filter((i) => i.status === "in-stock").length;

const getLowStockCount = () =>
  inventoryItems.value.filter((i) => i.status === "low").length;

const getOutOfStockCount = () =>
  inventoryItems.value.filter((i) => i.status === "out").length;

const editPart = (item) => {
  editingPart.value = item;
};

const deletePart = (id) => {
  inventoryItems.value = inventoryItems.value.filter((i) => i.id !== id);
};
</script>
