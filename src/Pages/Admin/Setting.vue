<template>
  <div v-if="!isLoading" :class="themeClass" class="min-h-screen flex flex-col">

    <!-- Topbar (sticky) -->
    <div class="sticky top-0 z-50">
      <Topbar />
    </div>

    <!-- Main Content -->
    <main class="flex-1 overflow-auto p-6">
      <h1 class="text-3xl font-bold mb-6 border-l-4 border-red-600 pl-4">Settings</h1>

      <!-- Settings Tabs -->
      <div class="flex space-x-4 mb-6 border-b border-gray-300">
        <button @click="activeTab = 'general'" :class="tabClass('general')" class="hover:bg-red-50 hover:text-red-600 transition-all duration-200 px-4 py-2 rounded-t">General</button>
        <button @click="activeTab = 'inventory'" :class="tabClass('inventory')" class="hover:bg-red-50 hover:text-red-600 transition-all duration-200 px-4 py-2 rounded-t">Inventory</button>
        <button @click="activeTab = 'notifications'" :class="tabClass('notifications')" class="hover:bg-red-50 hover:text-red-600 transition-all duration-200 px-4 py-2 rounded-t">Notifications</button>
        <button @click="activeTab = 'warehouse'" :class="tabClass('warehouse')" class="hover:bg-red-50 hover:text-red-600 transition-all duration-200 px-4 py-2 rounded-t">Warehouse</button>
      </div>


      <!-- Loading State -->
      <div v-if="isSaving" class="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4">
        Saving settings...
      </div>

      <!-- Success Message -->
      <div v-if="saveSuccess" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
        Settings saved successfully!
      </div>

      <!-- Error Message -->
      <div v-if="saveError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
        Error saving settings: {{ saveError }}
      </div>

      <!-- Tab Content -->
      <div class="space-y-6">

        <!-- General -->
        <div v-if="activeTab === 'general'">
          <div :class="cardClass" class="border-l-2 border-red-600 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
            <h2 class="text-xl font-bold mb-4">General Settings</h2>
            <div class="space-y-4">
              <div>
                <label class="block mb-1">Company Name</label>
                <input v-model="settings.general.companyName" type="text" class="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-600 hover:border-red-400 hover:shadow-sm transition-all duration-200"/>
              </div>
              <div>
                <label class="block mb-1">Company Email</label>
                <input v-model="settings.general.companyEmail" type="email" class="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-600 hover:border-red-400 hover:shadow-sm transition-all duration-200"/>
              </div>
              <div>
                <label class="block mb-1">Phone Number</label>
                <input v-model="settings.general.phone" type="tel" class="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-600 hover:border-red-400 hover:shadow-sm transition-all duration-200"/>
              </div>
              <div>
                <label class="block mb-1">Language</label>
                <select v-model="settings.general.language" class="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-600 hover:border-red-400 hover:shadow-sm transition-all duration-200">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              <div>
                <label class="block mb-1">Theme</label>
                <select v-model="settings.general.theme" class="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-600 hover:border-red-400 hover:shadow-sm transition-all duration-200">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              <button 
                @click="saveSettings('general')" 
                :disabled="isSaving"
                class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isSaving ? 'Saving...' : 'Save General Settings' }}
              </button>
            </div>
          </div>
        </div>


        <!-- Inventory -->
        <div v-if="activeTab === 'inventory'">
          <div :class="cardClass" class="border-l-2 border-red-600 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
            <h2 class="text-xl font-bold mb-4">Inventory Settings</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label>Low Stock Alert Threshold</label>
                <input v-model.number="settings.inventory.lowStockThreshold" type="number" class="w-full border rounded px-4 py-2 hover:border-red-400 hover:shadow-sm transition-all duration-200"/>
              </div>
              <div>
                <label>Minimum Reorder Quantity</label>
                <input v-model.number="settings.inventory.minReorderQty" type="number" class="w-full border rounded px-4 py-2 hover:border-red-400 hover:shadow-sm transition-all duration-200"/>
              </div>
              <div>
                <label>Default Reorder Quantity</label>
                <input v-model.number="settings.inventory.defaultReorderQty" type="number" class="w-full border rounded px-4 py-2 hover:border-red-400 hover:shadow-sm transition-all duration-200"/>
              </div>
              <div>
                <label>Stock Check Interval (days)</label>
                <input v-model.number="settings.inventory.stockCheckInterval" type="number" class="w-full border rounded px-4 py-2 hover:border-red-400 hover:shadow-sm transition-all duration-200"/>
              </div>
            </div>
            <div class="mt-4">
              <label class="flex items-center hover:text-red-600 transition-colors duration-200 cursor-pointer">
                <input v-model="settings.inventory.autoReorder" type="checkbox" class="mr-2 w-5 h-5 hover:ring-2 hover:ring-red-400 transition-all duration-200"/>
                Enable Auto Reorder
              </label>
            </div>
            <button 
              @click="saveSettings('inventory')" 
              :disabled="isSaving"
              class="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSaving ? 'Saving...' : 'Save Inventory Settings' }}
            </button>
          </div>
        </div>


        <!-- Notifications -->
        <div v-if="activeTab === 'notifications'">
          <div :class="cardClass" class="border-l-2 border-red-600 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
            <h2 class="text-xl font-bold mb-4">Notification Settings</h2>
            <div class="space-y-4">
              <div v-for="(label, key) in notificationLabels" :key="key" class="flex justify-between items-center p-4 rounded hover:bg-red-50 hover:shadow-md transition-all duration-200 cursor-pointer" :class="settings.general.theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50'">
                <div>
                  <h3 class="font-medium">{{ label }}</h3>
                </div>
                <input type="checkbox" v-model="settings.notifications[key]" class="w-5 h-5 hover:ring-2 hover:ring-red-400 transition-all duration-200"/>
              </div>
            </div>
            <button 
              @click="saveSettings('notifications')" 
              :disabled="isSaving"
              class="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSaving ? 'Saving...' : 'Save Notification Settings' }}
            </button>
          </div>
        </div>


        <!-- Warehouse -->
        <div v-if="activeTab === 'warehouse'">
          <div :class="cardClass" class="border-l-2 border-red-600 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
            <h2 class="text-xl font-bold mb-4">Warehouse Locations</h2>
            <div class="space-y-4">
              <div v-for="(wh, idx) in settings.warehouse.locations" :key="idx" class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-4 rounded hover:bg-red-50 hover:shadow-md transition-all duration-200" :class="settings.general.theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50'">
                <input v-model="wh.name" placeholder="Warehouse Name" class="border rounded px-3 py-2 hover:border-red-400 hover:shadow-sm transition-all duration-200"/>
                <input v-model="wh.location" placeholder="Location" class="border rounded px-3 py-2 hover:border-red-400 hover:shadow-sm transition-all duration-200"/>
                <div class="flex space-x-2">
                  <input v-model.number="wh.capacity" type="number" placeholder="Capacity" class="border rounded px-3 py-2 hover:border-red-400 hover:shadow-sm transition-all duration-200"/>
                  <button @click="removeWarehouse(idx)" class="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">Remove</button>
                </div>
              </div>
            </div>
            <button @click="addWarehouse" class="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">+ Add Warehouse</button>
            <button 
              @click="saveSettings('warehouse')" 
              :disabled="isSaving"
              class="mt-4 ml-2 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSaving ? 'Saving...' : 'Save Warehouse Settings' }}
            </button>
          </div>
        </div>


      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { auth, db } from "../../Firebase/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Topbar from "../../components/Topbar.vue";

const router = useRouter();
const activeTab = ref("general");
const isLoading = ref(true);
const isSaving = ref(false);
const saveSuccess = ref(false);
const saveError = ref(null);
const currentUser = ref(null);

// Default settings
const defaultSettings = {
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
};

const settings = ref(JSON.parse(JSON.stringify(defaultSettings)));

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

// Load settings from Firestore
const loadSettings = async (userId) => {
  try {
    const settingsDoc = await getDoc(doc(db, "users", userId, "settings", "preferences"));
    if (settingsDoc.exists()) {
      const data = settingsDoc.data();
      // Merge with defaults to ensure all fields exist
      settings.value = {
        general: { ...defaultSettings.general, ...data.general },
        inventory: { ...defaultSettings.inventory, ...data.inventory },
        notifications: { ...defaultSettings.notifications, ...data.notifications },
        warehouse: { ...defaultSettings.warehouse, ...data.warehouse },
      };
    } else {
      // No settings found, use defaults and save them
      await saveSettingsToFirebase(userId);
    }
  } catch (error) {
    console.error("Error loading settings:", error);
    saveError.value = "Failed to load settings from database.";
  }
};

// Save settings to Firestore
const saveSettingsToFirebase = async (userId) => {
  try {
    await setDoc(doc(db, "users", userId, "settings", "preferences"), {
      general: settings.value.general,
      inventory: settings.value.inventory,
      notifications: settings.value.notifications,
      warehouse: settings.value.warehouse,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error("Error saving settings:", error);
    throw error;
  }
};

// Save settings handler
const saveSettings = async (tab) => {
  if (!currentUser.value) {
    saveError.value = "You must be logged in to save settings.";
    return;
  }

  isSaving.value = true;
  saveSuccess.value = false;
  saveError.value = null;

  try {
    await saveSettingsToFirebase(currentUser.value.uid);
    saveSuccess.value = true;
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      saveSuccess.value = false;
    }, 3000);
  } catch (error) {
    saveError.value = error.message || "Failed to save settings. Please try again.";
  } finally {
    isSaving.value = false;
  }
};

const addWarehouse = () => {
  settings.value.warehouse.locations.push({ name: "", location: "", capacity: 0 });
};

const removeWarehouse = (idx) => {
  settings.value.warehouse.locations.splice(idx, 1);
};

// Apply theme function
const applyTheme = (theme) => {
  const html = document.documentElement;
  html.classList.remove("dark", "light");
  if (theme === "dark") html.classList.add("dark");
  else if (theme === "light") html.classList.add("light");
  localStorage.setItem("appTheme", theme);
};

// Lifecycle
onMounted(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      router.push("/");
      return;
    }
    
    currentUser.value = user;
    
    // Load saved theme from localStorage first
    const savedTheme = localStorage.getItem("appTheme");
    if (savedTheme) {
      settings.value.general.theme = savedTheme;
    }
    
    // Load settings from Firestore
    await loadSettings(user.uid);
    
    // Apply theme
    applyTheme(settings.value.general.theme);
    
    isLoading.value = false;
  });
  
  return () => unsubscribe();
});

// Watch for theme changes
watch(() => settings.value.general.theme, (newTheme) => {
  applyTheme(newTheme);
});

// Tab button class
const tabClass = (tab) =>
  `px-4 py-2 font-medium transition ${activeTab.value === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`;
</script>

<style scoped>
body { font-family: "Inter", sans-serif; }
</style>
