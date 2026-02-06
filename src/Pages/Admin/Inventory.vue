<template>
  <div v-if="!isLoading" class="min-h-screen bg-gray-100">
    <!-- Topbar -->
    <Topbar />

    <!-- Main Content -->
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-6 text-gray-800 border-l-4 border-red-600 pl-4">Inventory Management</h1>


      <!-- Status Messages -->
      <div v-if="saveSuccess" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
        {{ saveSuccess }}
      </div>
      <div v-if="saveError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
        {{ saveError }}
      </div>

      <!-- Search and Filter Bar -->
      <div class="bg-white shadow-lg rounded-lg p-6 mb-6 border-t-2 border-red-600">

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
              @click="openAddModal"
              :disabled="isSaving"
              class="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSaving ? 'Saving...' : '+ Add New Part' }}
            </button>
          </div>

        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-l-2 border-red-600">

          <p class="text-gray-600 text-sm">Total Parts</p>
          <p class="text-3xl font-bold text-gray-800">{{ inventoryItems.length }}</p>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-l-2 border-red-600">
          <p class="text-gray-600 text-sm">In Stock</p>

          <p class="text-3xl font-bold text-green-600">{{ getInStockCount() }}</p>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-l-2 border-red-600">
          <p class="text-gray-600 text-sm">Low Stock</p>

          <p class="text-3xl font-bold text-yellow-600">{{ getLowStockCount() }}</p>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-l-2 border-red-600">
          <p class="text-gray-600 text-sm">Out of Stock</p>

          <p class="text-3xl font-bold text-red-600">{{ getOutOfStockCount() }}</p>
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
                  :disabled="isSaving"
                  class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
                >
                  Edit
                </button>

                <button
                  @click="deletePart(item.id)"
                  :disabled="isSaving"
                  class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div class="bg-white shadow-lg rounded-lg p-4 mt-4 border-l-2 border-red-600">

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
import { auth, db } from "../../Firebase/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import Topbar from "../../Components/Topbar.vue";

const router = useRouter();
const isLoading = ref(true);
const isSaving = ref(false);
const saveSuccess = ref("");
const saveError = ref("");
const currentUser = ref(null);

const searchQuery = ref("");
const filterCategory = ref("");
const filterStatus = ref("");
const showAddPartModal = ref(false);
const editingPart = ref(null);

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(10);
const itemsPerPageOptions = [5, 10, 25, 50, 100];

// Hardcoded sample data (kept as requested)
const sampleInventoryData = [
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
  {
    id: 2,
    partCode: "ISZ-002",
    partName: "Air Filter",
    category: "Engine Parts",
    quantity: 25,
    minLevel: 50,
    unitPrice: 894,
    status: "low",
  },
  {
    id: 3,
    partCode: "ISZ-003",
    partName: "Transmission Fluid",
    category: "Transmission",
    quantity: 80,
    minLevel: 50,
    unitPrice: 2575,
    status: "in-stock",
  },
  {
    id: 4,
    partCode: "ISZ-004",
    partName: "Brake Pads",
    category: "Suspension",
    quantity: 0,
    minLevel: 30,
    unitPrice: 4815,
    status: "out",
  },
  {
    id: 5,
    partCode: "ISZ-005",
    partName: "Battery",
    category: "Electrical",
    quantity: 45,
    minLevel: 20,
    unitPrice: 6775,
    status: "in-stock",
  },
  {
    id: 6,
    partCode: "ISZ-006",
    partName: "Door Handle",
    category: "Body Parts",
    quantity: 110,
    minLevel: 40,
    unitPrice: 2015,
    status: "in-stock",
  },
  {
    id: 7,
    partCode: "ISZ-007",
    partName: "Spark Plugs",
    category: "Engine Parts",
    quantity: 200,
    minLevel: 100,
    unitPrice: 727,
    status: "in-stock",
  },
  {
    id: 8,
    partCode: "ISZ-008",
    partName: "Alternator",
    category: "Electrical",
    quantity: 15,
    minLevel: 25,
    unitPrice: 14055,
    status: "low",
  },
];

const inventoryItems = ref([...sampleInventoryData]);

// Load inventory from Firestore
const loadInventory = async (userId) => {
  try {
    const inventoryRef = collection(db, "users", userId, "inventory");
    const q = query(inventoryRef, orderBy("partCode"));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // If Firestore has data, use it
      const firestoreData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      inventoryItems.value = firestoreData;
    } else {
      // If Firestore is empty, save sample data to Firestore
      await saveSampleDataToFirestore(userId);
    }
  } catch (error) {
    console.error("Error loading inventory:", error);
    saveError.value = "Failed to load inventory from database. Using sample data.";
    // Keep sample data on error
    inventoryItems.value = [...sampleInventoryData];
  }
};

// Save sample data to Firestore
const saveSampleDataToFirestore = async (userId) => {
  try {
    const inventoryRef = collection(db, "users", userId, "inventory");
    for (const item of sampleInventoryData) {
      await addDoc(inventoryRef, {
        partCode: item.partCode,
        partName: item.partName,
        category: item.category,
        quantity: item.quantity,
        minLevel: item.minLevel,
        unitPrice: item.unitPrice,
        status: item.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    saveSuccess.value = "Sample data saved to database!";
    setTimeout(() => saveSuccess.value = "", 3000);
  } catch (error) {
    console.error("Error saving sample data:", error);
  }
};

// Add new part to Firestore
const addPart = async (partData) => {
  if (!currentUser.value) return;
  
  isSaving.value = true;
  saveError.value = "";
  
  try {
    const inventoryRef = collection(db, "users", currentUser.value.uid, "inventory");
    const docRef = await addDoc(inventoryRef, {
      ...partData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    // Add to local state with Firestore ID
    inventoryItems.value.push({
      id: docRef.id,
      ...partData
    });
    
    saveSuccess.value = "Part added successfully!";
    setTimeout(() => saveSuccess.value = "", 3000);
  } catch (error) {
    console.error("Error adding part:", error);
    saveError.value = "Failed to add part. Please try again.";
  } finally {
    isSaving.value = false;
  }
};

// Update part in Firestore
const updatePart = async (id, updatedData) => {
  if (!currentUser.value) return;
  
  isSaving.value = true;
  saveError.value = "";
  
  try {
    const partRef = doc(db, "users", currentUser.value.uid, "inventory", id);
    await updateDoc(partRef, {
      ...updatedData,
      updatedAt: new Date().toISOString(),
    });
    
    // Update local state
    const index = inventoryItems.value.findIndex(item => item.id === id);
    if (index !== -1) {
      inventoryItems.value[index] = { ...inventoryItems.value[index], ...updatedData };
    }
    
    saveSuccess.value = "Part updated successfully!";
    setTimeout(() => saveSuccess.value = "", 3000);
  } catch (error) {
    console.error("Error updating part:", error);
    saveError.value = "Failed to update part. Please try again.";
  } finally {
    isSaving.value = false;
  }
};

// Delete part from Firestore
const deletePart = async (id) => {
  if (!currentUser.value) return;
  
  // Confirm deletion
  if (!confirm("Are you sure you want to delete this part?")) return;
  
  isSaving.value = true;
  saveError.value = "";
  
  try {
    const partRef = doc(db, "users", currentUser.value.uid, "inventory", id);
    await deleteDoc(partRef);
    
    // Remove from local state
    inventoryItems.value = inventoryItems.value.filter((i) => i.id !== id);
    
    saveSuccess.value = "Part deleted successfully!";
    setTimeout(() => saveSuccess.value = "", 3000);
  } catch (error) {
    console.error("Error deleting part:", error);
    saveError.value = "Failed to delete part. Please try again.";
  } finally {
    isSaving.value = false;
  }
};

// Open add modal (placeholder for future modal implementation)
const openAddModal = () => {
  // For now, just add a sample item to demonstrate Firebase connection
  const newPart = {
    partCode: `ISZ-${String(inventoryItems.value.length + 1).padStart(3, '0')}`,
    partName: "New Part",
    category: "Engine Parts",
    quantity: 100,
    minLevel: 50,
    unitPrice: 1000,
    status: "in-stock",
  };
  addPart(newPart);
};

// Edit part (placeholder for future edit modal implementation)
const editPart = (item) => {
  editingPart.value = item;
  // For now, just increment quantity to demonstrate update
  const updatedData = {
    ...item,
    quantity: item.quantity + 1,
  };
  updatePart(item.id, updatedData);
};

onMounted(() => {
  // Load and apply saved theme from localStorage
  const savedTheme = localStorage.getItem("appTheme");
  if (savedTheme) {
    applyTheme(savedTheme);
  }

  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      router.push("/");
      return;
    }
    
    currentUser.value = user;
    await loadInventory(user.uid);
    isLoading.value = false;
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
    const matchesSearch = item.partName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         item.partCode.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCategory = filterCategory.value === "" || item.category === filterCategory.value;
    const matchesStatus = filterStatus.value === "" || item.status === filterStatus.value;
    return matchesSearch && matchesCategory && matchesStatus;
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
  return Math.ceil(filteredInventory.length / itemsPerPage.value) || 1;
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
</script>
