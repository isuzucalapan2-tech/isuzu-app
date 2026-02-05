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
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Search by part name or code..."
            />
          </div>

          <!-- Category Filter -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">Category</label>
            <select
              v-model="filterCategory"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
        <div class="bg-white shadow-lg rounded-lg p-4">
          <p class="text-gray-600 text-sm">Total Parts</p>
          <p class="text-3xl font-bold text-gray-800">{{ inventoryItems.length }}</p>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-4">
          <p class="text-gray-600 text-sm">In Stock</p>
          <p class="text-3xl font-bold text-green-600">{{ getInStockCount() }}</p>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-4">
          <p class="text-gray-600 text-sm">Low Stock</p>
          <p class="text-3xl font-bold text-yellow-600">{{ getLowStockCount() }}</p>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-4">
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
              v-for="item in filteredInventory"
              :key="item.id"
              class="border-b hover:bg-gray-50"
            >
              <td class="px-6 py-4">{{ item.partCode }}</td>
              <td class="px-6 py-4">{{ item.partName }}</td>
              <td class="px-6 py-4">{{ item.category }}</td>
              <td class="px-6 py-4 font-bold">{{ item.quantity }}</td>
              <td class="px-6 py-4">{{ item.minLevel }}</td>

              <td class="px-6 py-4">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-bold',
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

              <td class="px-6 py-4">₱{{ item.unitPrice.toFixed(2) }}</td>

              <td class="px-6 py-4 space-x-2">
                <button
                  @click="editPart(item)"
                  class="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  @click="deletePart(item.id)"
                  class="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    isLoading.value = false;
    if (!user) {
      router.push("/");
    }
  });
  return () => unsubscribe();
});

const filteredInventory = computed(() => {
  return inventoryItems.value.filter((item) => {
    return (
      item.partName.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
      (filterCategory.value === "" || item.category === filterCategory.value) &&
      (filterStatus.value === "" || item.status === filterStatus.value)
    );
  });
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
