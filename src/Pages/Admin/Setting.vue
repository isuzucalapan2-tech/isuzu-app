<template>
  <div class="flex min-h-screen" :class="settings.general.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'">
    <!-- Sidebar -->
    <div class="sticky top-0 h-screen overflow-y-auto">
      <Sidebar />
    </div>

    <!-- Main Content -->
    <div class="flex-1 p-6">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">Settings</h1>

      <!-- Settings Tabs -->
      <div class="flex space-x-4 mb-6 border-b border-gray-300">
        <button
          @click="activeTab = 'general'"
          :class="[
            'px-4 py-2 font-medium transition',
            activeTab === 'general'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800',
          ]"
        >
          General
        </button>
        <button
          @click="activeTab = 'inventory'"
          :class="[
            'px-4 py-2 font-medium transition',
            activeTab === 'inventory'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800',
          ]"
        >
          Inventory
        </button>
        <button
          @click="activeTab = 'notifications'"
          :class="[
            'px-4 py-2 font-medium transition',
            activeTab === 'notifications'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800',
          ]"
        >
          Notifications
        </button>
        <button
          @click="activeTab = 'warehouse'"
          :class="[
            'px-4 py-2 font-medium transition',
            activeTab === 'warehouse'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800',
          ]"
        >
          Warehouse
        </button>
      </div>

      <!-- General Settings Tab -->
      <div v-if="activeTab === 'general'" class="space-y-6">
        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-xl font-bold mb-4 text-gray-800">General Settings</h2>

          <!-- Company Name -->
          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-2"
              >Company Name</label
            >
            <input
              v-model="settings.general.companyName"
              type="text"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter company name"
            />
          </div>

          <!-- Company Email -->
          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-2"
              >Company Email</label
            >
            <input
              v-model="settings.general.companyEmail"
              type="email"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter company email"
            />
          </div>

          <!-- Phone Number -->
          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-2"
              >Phone Number</label
            >
            <input
              v-model="settings.general.phone"
              type="tel"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter phone number"
            />
          </div>

          <!-- Language Selection -->
          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-2"
              >Language</label
            >
            <select
              v-model="settings.general.language"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <!-- Theme Selection -->
          <div class="mb-6">
            <label class="block text-gray-700 font-medium mb-2"
              >Theme</label
            >
            <select
              v-model="settings.general.theme"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <button
            @click="saveSettings('general')"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Save General Settings
          </button>
        </div>
      </div>

      <!-- Inventory Settings Tab -->
      <div v-if="activeTab === 'inventory'" class="space-y-6">
        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-xl font-bold mb-4 text-gray-800">
            Inventory Settings
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Low Stock Alert Threshold -->
            <div>
              <label class="block text-gray-700 font-medium mb-2"
                >Low Stock Alert Threshold</label
              >
              <input
                v-model.number="settings.inventory.lowStockThreshold"
                type="number"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="e.g., 50"
              />
              <p class="text-sm text-gray-500 mt-1">
                Alert when stock falls below this level
              </p>
            </div>

            <!-- Minimum Reorder Quantity -->
            <div>
              <label class="block text-gray-700 font-medium mb-2"
                >Minimum Reorder Quantity</label
              >
              <input
                v-model.number="settings.inventory.minReorderQty"
                type="number"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="e.g., 100"
              />
              <p class="text-sm text-gray-500 mt-1">
                Minimum quantity for reordering
              </p>
            </div>

            <!-- Default Reorder Quantity -->
            <div>
              <label class="block text-gray-700 font-medium mb-2"
                >Default Reorder Quantity</label
              >
              <input
                v-model.number="settings.inventory.defaultReorderQty"
                type="number"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="e.g., 500"
              />
            </div>

            <!-- Stock Check Interval -->
            <div>
              <label class="block text-gray-700 font-medium mb-2"
                >Stock Check Interval (days)</label
              >
              <input
                v-model.number="settings.inventory.stockCheckInterval"
                type="number"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="e.g., 7"
              />
            </div>
          </div>

          <!-- Auto Reorder Toggle -->
          <div class="mt-6">
            <label class="flex items-center">
              <input
                v-model="settings.inventory.autoReorder"
                type="checkbox"
                class="w-4 h-4 text-blue-600"
              />
              <span class="ml-2 text-gray-700">Enable Auto Reorder</span>
            </label>
            <p class="text-sm text-gray-500 mt-1">
              Automatically create reorder requests when stock is low
            </p>
          </div>

          <div class="mt-6">
            <button
              @click="saveSettings('inventory')"
              class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Save Inventory Settings
            </button>
          </div>
        </div>
      </div>

      <!-- Notifications Tab -->
      <div v-if="activeTab === 'notifications'" class="space-y-6">
        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-xl font-bold mb-4 text-gray-800">
            Notification Settings
          </h2>

          <div class="space-y-4">
            <!-- Email Notifications -->
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 class="font-medium text-gray-800">Email Notifications</h3>
                <p class="text-sm text-gray-500">
                  Receive updates via email
                </p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="settings.notifications.emailNotifications"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                ></div>
              </label>
            </div>

            <!-- Low Stock Alerts -->
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 class="font-medium text-gray-800">Low Stock Alerts</h3>
                <p class="text-sm text-gray-500">
                  Alert when items are running low
                </p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="settings.notifications.lowStockAlerts"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                ></div>
              </label>
            </div>

            <!-- Reorder Notifications -->
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 class="font-medium text-gray-800">Reorder Notifications</h3>
                <p class="text-sm text-gray-500">
                  Notify when reorders are needed
                </p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="settings.notifications.reorderNotifications"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                ></div>
              </label>
            </div>

            <!-- System Updates -->
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 class="font-medium text-gray-800">System Updates</h3>
                <p class="text-sm text-gray-500">
                  Notify about system updates and maintenance
                </p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="settings.notifications.systemUpdates"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                ></div>
              </label>
            </div>
          </div>

          <div class="mt-6">
            <button
              @click="saveSettings('notifications')"
              class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Save Notification Settings
            </button>
          </div>
        </div>
      </div>

      <!-- Warehouse Settings Tab -->
      <div v-if="activeTab === 'warehouse'" class="space-y-6">
        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-xl font-bold mb-4 text-gray-800">
            Warehouse Locations
          </h2>

          <!-- Warehouse List -->
          <div class="space-y-4 mb-6">
            <div
              v-for="(warehouse, index) in settings.warehouse.locations"
              :key="index"
              class="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Warehouse Name</label
                  >
                  <input
                    v-model="warehouse.name"
                    type="text"
                    class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder="e.g., Main Warehouse"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Location</label
                  >
                  <input
                    v-model="warehouse.location"
                    type="text"
                    class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder="e.g., Los Angeles, CA"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Capacity</label
                  >
                  <input
                    v-model.number="warehouse.capacity"
                    type="number"
                    class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder="e.g., 5000"
                  />
                </div>
                <div class="flex items-end">
                  <button
                    @click="removeWarehouse(index)"
                    class="w-full bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            @click="addWarehouse"
            class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition mb-6"
          >
            + Add Warehouse
          </button>

          <button
            @click="saveSettings('warehouse')"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Save Warehouse Settings
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { auth } from "../../Firebase/Firebase";
import Sidebar from "../../Components/Sidebar.vue";

const router = useRouter();
const activeTab = ref("general");

const settings = ref({
  general: {
    companyName: "Isuzu Motors Parts Philippines - Calapan Branch",
    companyEmail: "calapan@isuzumotors.ph",
    phone: "+63 (43) 288-5000",
    language: "en",
    theme: "light",
  },
  inventory: {
    lowStockThreshold: 50,
    minReorderQty: 100,
    defaultReorderQty: 500,
    stockCheckInterval: 7,
    autoReorder: true,
  },
  notifications: {
    emailNotifications: true,
    lowStockAlerts: true,
    reorderNotifications: true,
    systemUpdates: true,
  },
  warehouse: {
    locations: [
      {
        name: "Main Warehouse - Calapan",
        location: "Calapan, Mindoro, Philippines",
        capacity: 5000,
      },
      {
        name: "Secondary Warehouse - Manila",
        location: "Manila, Metro Manila, Philippines",
        capacity: 3000,
      },
    ],
  },
});

// User check
onMounted(() => {
  const user = auth.currentUser;
  if (!user) {
    router.push("/");
  }
  // Load saved theme from localStorage
  const savedTheme = localStorage.getItem("appTheme");
  if (savedTheme) {
    settings.value.general.theme = savedTheme;
  }
  // Apply theme
  applyTheme(settings.value.general.theme);
});

// Watch for theme changes
watch(
  () => settings.value.general.theme,
  (newTheme) => {
    applyTheme(newTheme);
  }
);

// Apply theme function
const applyTheme = (theme) => {
  const htmlElement = document.documentElement;
  const bodyElement = document.body;
  
  // Remove all theme classes first
  htmlElement.classList.remove("dark", "light");
  
  if (theme === "dark") {
    htmlElement.classList.add("dark");
    bodyElement.style.backgroundColor = "#111827";
    bodyElement.style.color = "#f3f4f6";
  } else if (theme === "light") {
    htmlElement.classList.add("light");
    bodyElement.style.backgroundColor = "#ffffff";
    bodyElement.style.color = "#1f2937";
  } else if (theme === "auto") {
    // Auto theme based on system preference
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      htmlElement.classList.add("dark");
      bodyElement.style.backgroundColor = "#111827";
      bodyElement.style.color = "#f3f4f6";
    } else {
      htmlElement.classList.add("light");
      bodyElement.style.backgroundColor = "#ffffff";
      bodyElement.style.color = "#1f2937";
    }
  }
  // Save to localStorage
  localStorage.setItem("appTheme", theme);
};

// Save Settings
const saveSettings = (tab) => {
  alert(`${tab.charAt(0).toUpperCase() + tab.slice(1)} settings saved!`);
  console.log("Settings saved:", settings.value[tab]);
};

// Add Warehouse
const addWarehouse = () => {
  settings.value.warehouse.locations.push({
    name: "",
    location: "",
    capacity: 0,
  });
};

// Remove Warehouse
const removeWarehouse = (index) => {
  settings.value.warehouse.locations.splice(index, 1);
};
</script>

<style scoped>
body {
  font-family: "Inter", sans-serif;
}
</style>
