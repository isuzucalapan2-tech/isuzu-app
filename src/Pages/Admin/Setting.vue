<template>
  <div :class="themeClass" class="min-h-screen flex flex-col">

    <!-- Topbar (sticky) -->
    <div class="sticky top-0 z-50">
      <Topbar />
    </div>

    <!-- Main Content -->
    <main class="flex-1 overflow-auto p-6">
      <h1 class="text-3xl font-bold mb-6">Settings</h1>

      <!-- Settings Tabs -->
      <div class="flex space-x-4 mb-6 border-b border-gray-300">
        <button @click="activeTab = 'general'" :class="tabClass('general')">General</button>
        <button @click="activeTab = 'inventory'" :class="tabClass('inventory')">Inventory</button>
        <button @click="activeTab = 'notifications'" :class="tabClass('notifications')">Notifications</button>
        <button @click="activeTab = 'warehouse'" :class="tabClass('warehouse')">Warehouse</button>
      </div>

      <!-- Tab Content -->
      <div class="space-y-6">

        <!-- General -->
        <div v-if="activeTab === 'general'">
          <div :class="cardClass">
            <h2 class="text-xl font-bold mb-4">General Settings</h2>
            <div class="space-y-4">
              <div>
                <label class="block mb-1">Company Name</label>
                <input v-model="settings.general.companyName" type="text" class="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-600"/>
              </div>
              <div>
                <label class="block mb-1">Company Email</label>
                <input v-model="settings.general.companyEmail" type="email" class="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-600"/>
              </div>
              <div>
                <label class="block mb-1">Phone Number</label>
                <input v-model="settings.general.phone" type="tel" class="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-600"/>
              </div>
              <div>
                <label class="block mb-1">Language</label>
                <select v-model="settings.general.language" class="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-600">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              <div>
                <label class="block mb-1">Theme</label>
                <select v-model="settings.general.theme" class="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-600">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              <button @click="saveSettings('general')" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                Save General Settings
              </button>
            </div>
          </div>
        </div>

        <!-- Inventory -->
        <div v-if="activeTab === 'inventory'">
          <div :class="cardClass">
            <h2 class="text-xl font-bold mb-4">Inventory Settings</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label>Low Stock Alert Threshold</label>
                <input v-model.number="settings.inventory.lowStockThreshold" type="number" class="w-full border rounded px-4 py-2"/>
              </div>
              <div>
                <label>Minimum Reorder Quantity</label>
                <input v-model.number="settings.inventory.minReorderQty" type="number" class="w-full border rounded px-4 py-2"/>
              </div>
              <div>
                <label>Default Reorder Quantity</label>
                <input v-model.number="settings.inventory.defaultReorderQty" type="number" class="w-full border rounded px-4 py-2"/>
              </div>
              <div>
                <label>Stock Check Interval (days)</label>
                <input v-model.number="settings.inventory.stockCheckInterval" type="number" class="w-full border rounded px-4 py-2"/>
              </div>
            </div>
            <div class="mt-4">
              <label class="flex items-center">
                <input v-model="settings.inventory.autoReorder" type="checkbox" class="mr-2"/>
                Enable Auto Reorder
              </label>
            </div>
            <button @click="saveSettings('inventory')" class="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">Save Inventory Settings</button>
          </div>
        </div>

        <!-- Notifications -->
        <div v-if="activeTab === 'notifications'">
          <div :class="cardClass">
            <h2 class="text-xl font-bold mb-4">Notification Settings</h2>
            <div class="space-y-4">
              <div v-for="(label, key) in notificationLabels" :key="key" class="flex justify-between items-center p-4 rounded" :class="settings.general.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'">
                <div>
                  <h3 class="font-medium">{{ label }}</h3>
                </div>
                <input type="checkbox" v-model="settings.notifications[key]" class="w-5 h-5"/>
              </div>
            </div>
            <button @click="saveSettings('notifications')" class="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">Save Notification Settings</button>
          </div>
        </div>

        <!-- Warehouse -->
        <div v-if="activeTab === 'warehouse'">
          <div :class="cardClass">
            <h2 class="text-xl font-bold mb-4">Warehouse Locations</h2>
            <div class="space-y-4">
              <div v-for="(wh, idx) in settings.warehouse.locations" :key="idx" class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-4 rounded" :class="settings.general.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'">
                <input v-model="wh.name" placeholder="Warehouse Name" class="border rounded px-3 py-2"/>
                <input v-model="wh.location" placeholder="Location" class="border rounded px-3 py-2"/>
                <div class="flex space-x-2">
                  <input v-model.number="wh.capacity" type="number" placeholder="Capacity" class="border rounded px-3 py-2"/>
                  <button @click="removeWarehouse(idx)" class="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition">Remove</button>
                </div>
              </div>
            </div>
            <button @click="addWarehouse" class="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">+ Add Warehouse</button>
            <button @click="saveSettings('warehouse')" class="mt-4 ml-2 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">Save Warehouse Settings</button>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { auth } from "../../Firebase/Firebase";
import Topbar from "../../components/Topbar.vue";

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
      { name: "Main Warehouse - Calapan", location: "Calapan, Mindoro, Philippines", capacity: 5000 },
      { name: "Secondary Warehouse - Manila", location: "Manila, Metro Manila, Philippines", capacity: 3000 },
    ],
  },
});

const notificationLabels = {
  emailNotifications: "Email Notifications",
  lowStockAlerts: "Low Stock Alerts",
  reorderNotifications: "Reorder Notifications",
  systemUpdates: "System Updates",
};

// Theme classes
const themeClass = computed(() => {
  if (settings.value.general.theme === 'dark') return 'bg-gray-900 text-gray-100';
  if (settings.value.general.theme === 'light') return 'bg-gray-100 text-gray-900';
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900';
});
const cardClass = computed(() => settings.value.general.theme === 'dark' ? 'bg-gray-800 shadow-lg rounded-lg p-6' : 'bg-white shadow-lg rounded-lg p-6');

// Lifecycle
onMounted(() => {
  const user = auth.currentUser;
  if (!user) router.push("/");

  const savedTheme = localStorage.getItem("appTheme");
  if (savedTheme) settings.value.general.theme = savedTheme;
  applyTheme(settings.value.general.theme);
});

watch(() => settings.value.general.theme, (newTheme) => applyTheme(newTheme));

const applyTheme = (theme) => {
  const html = document.documentElement;
  html.classList.remove("dark", "light");
  if (theme === "dark") html.classList.add("dark");
  else if (theme === "light") html.classList.add("light");
  localStorage.setItem("appTheme", theme);
};

const saveSettings = (tab) => alert(`${tab} settings saved!`);
const addWarehouse = () => settings.value.warehouse.locations.push({ name: "", location: "", capacity: 0 });
const removeWarehouse = (idx) => settings.value.warehouse.locations.splice(idx, 1);

// Tab button class
const tabClass = (tab) =>
  `px-4 py-2 font-medium transition ${activeTab.value === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`;
</script>

<style scoped>
body { font-family: "Inter", sans-serif; }
</style>
