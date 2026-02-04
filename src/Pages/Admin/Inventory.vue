<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <div class="sticky top-0 h-screen overflow-y-auto">
      <Sidebar />
    </div>

    <!-- Main Content -->
    <div class="flex-1 p-6">
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
              <option value="Engine">Engine Parts</option>
              <option value="Transmission">Transmission</option>
              <option value="Suspension">Suspension</option>
              <option value="Electrical">Electrical</option>
              <option value="Body">Body Parts</option>
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

          <!-- Add New Part Button -->
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

      <!-- Inventory Stats Cards -->
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

      <!-- Inventory Table -->
      <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-200 border-b-2 border-gray-300">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-bold text-gray-800">Part Code</th>
              <th class="px-6 py-3 text-left text-sm font-bold text-gray-800">Part Name</th>
              <th class="px-6 py-3 text-left text-sm font-bold text-gray-800">Category</th>
              <th class="px-6 py-3 text-left text-sm font-bold text-gray-800">Stock Qty</th>
              <th class="px-6 py-3 text-left text-sm font-bold text-gray-800">Min Level</th>
              <th class="px-6 py-3 text-left text-sm font-bold text-gray-800">Status</th>
              <th class="px-6 py-3 text-left text-sm font-bold text-gray-800">Unit Price</th>
              <th class="px-6 py-3 text-left text-sm font-bold text-gray-800">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in filteredInventory"
              :key="item.id"
              class="border-b border-gray-200 hover:bg-gray-50 transition"
            >
              <td class="px-6 py-4 text-sm font-medium text-gray-800">{{ item.partCode }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ item.partName }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ item.category }}</td>
              <td class="px-6 py-4 text-sm font-bold text-gray-800">{{ item.quantity }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ item.minLevel }}</td>
              <td class="px-6 py-4 text-sm">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-bold',
                    item.status === 'in-stock'
                      ? 'bg-green-100 text-green-800'
                      : item.status === 'low'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800',
                  ]"
                >
                  {{ item.status === 'in-stock' ? 'In Stock' : item.status === 'low' ? 'Low Stock' : 'Out of Stock' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm font-medium text-gray-800">₱{{ item.unitPrice.toFixed(2) }}</td>
              <td class="px-6 py-4 text-sm space-x-2 flex">
                <button
                  @click="editPart(item)"
                  class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                >
                  Edit
                </button>
                <button
                  @click="deletePart(item.id)"
                  class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
                <button
                  v-if="item.status !== 'in-stock'"
                  @click="reorderPart(item)"
                  class="bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700 transition"
                >
                  Reorder
                </button>
              </td>
            </tr>

            <!-- No Results -->
            <tr v-if="filteredInventory.length === 0">
              <td colspan="8" class="text-center py-8 text-gray-500">
                No inventory items found
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add/Edit Part Modal -->
      <div
        v-if="showAddPartModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-6 w-96 max-h-screen overflow-y-auto">
          <h2 class="text-2xl font-bold mb-4 text-gray-800">
            {{ editingPart ? 'Edit Part' : 'Add New Part' }}
          </h2>

          <div class="space-y-4">
            <!-- Part Code -->
            <div>
              <label class="block text-gray-700 font-medium mb-2">Part Code</label>
              <input
                v-model="formData.partCode"
                type="text"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="e.g., ISZ-001"
              />
            </div>

            <!-- Part Name -->
            <div>
              <label class="block text-gray-700 font-medium mb-2">Part Name</label>
              <input
                v-model="formData.partName"
                type="text"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="e.g., Engine Oil Filter"
              />
            </div>

            <!-- Category -->
            <div>
              <label class="block text-gray-700 font-medium mb-2">Category</label>
              <select
                v-model="formData.category"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option>Engine Parts</option>
                <option>Transmission</option>
                <option>Suspension</option>
                <option>Electrical</option>
                <option>Body Parts</option>
              </select>
            </div>

            <!-- Quantity -->
            <div>
              <label class="block text-gray-700 font-medium mb-2">Stock Quantity</label>
              <input
                v-model.number="formData.quantity"
                type="number"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="0"
              />
            </div>

            <!-- Min Level -->
            <div>
              <label class="block text-gray-700 font-medium mb-2">Minimum Level</label>
              <input
                v-model.number="formData.minLevel"
                type="number"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="0"
              />
            </div>

            <!-- Unit Price -->
            <div>
              <label class="block text-gray-700 font-medium mb-2">Unit Price (₱)</label>
              <input
                v-model.number="formData.unitPrice"
                type="number"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="0.00"
              />
            </div>
          </div>

          <!-- Modal Buttons -->
          <div class="flex space-x-4 mt-6">
            <button
              @click="savePart"
              class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Save
            </button>
            <button
              @click="showAddPartModal = false; editingPart = null; resetForm()"
              class="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition font-medium"
            >
              Cancel
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
import Sidebar from "../../Components/Sidebar.vue";

const router = useRouter();
const searchQuery = ref("");
const filterCategory = ref("");
const filterStatus = ref("");
const showAddPartModal = ref(false);
const editingPart = ref(null);

const formData = ref({
  partCode: "",
  partName: "",
  category: "Engine Parts",
  quantity: 0,
  minLevel: 50,
  unitPrice: 0,
});

const inventoryItems = ref([
  {
    id: 1,
    partCode: "ISZ-001",
    partName: "Engine Oil Filter",
    category: "Engine Parts",
    quantity: 150,
    minLevel: 50,
    unitPrice: 1455.00,
    status: "in-stock",
  },
  {
    id: 2,
    partCode: "ISZ-002",
    partName: "Air Filter",
    category: "Engine Parts",
    quantity: 45,
    minLevel: 50,
    unitPrice: 894.00,
    status: "low",
  },
  {
    id: 3,
    partCode: "ISZ-003",
    partName: "Transmission Fluid",
    category: "Transmission",
    quantity: 0,
    minLevel: 30,
    unitPrice: 2575.00,
    status: "out",
  },
  {
    id: 4,
    partCode: "ISZ-004",
    partName: "Brake Pads Set",
    category: "Suspension",
    quantity: 200,
    minLevel: 50,
    unitPrice: 4815.00,
    status: "in-stock",
  },
  {
    id: 5,
    partCode: "ISZ-005",
    partName: "Battery 12V",
    category: "Electrical",
    quantity: 35,
    minLevel: 40,
    unitPrice: 6775.00,
    status: "low",
  },
  {
    id: 6,
    partCode: "ISZ-006",
    partName: "Door Handle (Front Left)",
    category: "Body Parts",
    quantity: 80,
    minLevel: 30,
    unitPrice: 2015.00,
    status: "in-stock",
  },
  {
    id: 7,
    partCode: "ISZ-007",
    partName: "Spark Plugs (Pack of 4)",
    category: "Engine Parts",
    quantity: 250,
    minLevel: 100,
    unitPrice: 727.00,
    status: "in-stock",
  },
  {
    id: 8,
    partCode: "ISZ-008",
    partName: "Alternator",
    category: "Electrical",
    quantity: 5,
    minLevel: 10,
    unitPrice: 14055.00,
    status: "low",
  },
]);

// User check
onMounted(() => {
  const user = auth.currentUser;
  if (!user) {
    router.push("/");
  }
});

// Filtered inventory based on search and filters
const filteredInventory = computed(() => {
  return inventoryItems.value.filter((item) => {
    const matchesSearch =
      item.partCode.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.partName.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesCategory =
      filterCategory.value === "" || item.category === filterCategory.value;

    const matchesStatus =
      filterStatus.value === "" || item.status === filterStatus.value;

    return matchesSearch && matchesCategory && matchesStatus;
  });
});

// Statistics functions
const getInStockCount = () => {
  return inventoryItems.value.filter((item) => item.status === "in-stock").length;
};

const getLowStockCount = () => {
  return inventoryItems.value.filter((item) => item.status === "low").length;
};

const getOutOfStockCount = () => {
  return inventoryItems.value.filter((item) => item.status === "out").length;
};

// Add new part
const savePart = () => {
  if (editingPart.value) {
    const index = inventoryItems.value.findIndex(
      (item) => item.id === editingPart.value.id
    );
    if (index !== -1) {
      inventoryItems.value[index] = {
        ...inventoryItems.value[index],
        ...formData.value,
      };
    }
  } else {
    inventoryItems.value.push({
      id: Math.max(...inventoryItems.value.map((item) => item.id), 0) + 1,
      ...formData.value,
      status: formData.value.quantity > formData.value.minLevel ? "in-stock" : "low",
    });
  }
  showAddPartModal.value = false;
  resetForm();
  editingPart.value = null;
};

// Edit part
const editPart = (item) => {
  editingPart.value = item;
  formData.value = { ...item };
  showAddPartModal.value = true;
};

// Delete part
const deletePart = (id) => {
  if (confirm("Are you sure you want to delete this part?")) {
    inventoryItems.value = inventoryItems.value.filter((item) => item.id !== id);
  }
};

// Reorder part
const reorderPart = (item) => {
  alert(`Reorder request created for ${item.partName} (${item.partCode})`);
};

// Reset form
const resetForm = () => {
  formData.value = {
    partCode: "",
    partName: "",
    category: "Engine Parts",
    quantity: 0,
    minLevel: 50,
    unitPrice: 0,
  };
};
</script>

<style scoped>
body {
  font-family: "Inter", sans-serif;
}
</style>
