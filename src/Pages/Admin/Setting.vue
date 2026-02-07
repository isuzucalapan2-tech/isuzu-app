<template>
  <div v-if="!isLoading" :class="themeClass" :style="themeStyle" class="min-h-screen flex flex-col">


    <!-- Topbar (sticky) -->
    <div class="sticky top-0 z-50">
      <Topbar />
    </div>

    <!-- Main Content -->
    <main class="flex-1 overflow-auto p-6">

      <!-- Header with Logout -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold border-l-4 border-red-600 pl-4 flex items-center gap-2">
          <SettingsIcon class="w-6 h-6 text-red-600" /> Settings
        </h1>

        <button
          @click="logout"
          class="bg-red-600 text-white px-5 py-2 rounded flex items-center gap-2"
        >
          <LogOutIcon class="w-5 h-5" /> Logout
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex space-x-4 mb-6 border-b border-gray-300">
        <button @click="activeTab = 'general'" :class="tabClass('general')" class="px-4 py-2 flex items-center gap-1">
          <UserIcon class="w-5 h-5" /> General
        </button>
        <button @click="activeTab = 'inventory'" :class="tabClass('inventory')" class="px-4 py-2 flex items-center gap-1">
          <PackageIcon class="w-5 h-5" /> Inventory
        </button>
        <button @click="activeTab = 'notifications'" :class="tabClass('notifications')" class="px-4 py-2 flex items-center gap-1">
          <BellIcon class="w-5 h-5" /> Notifications
        </button>
        <button @click="activeTab = 'warehouse'" :class="tabClass('warehouse')" class="px-4 py-2 flex items-center gap-1">
          <MapPinIcon class="w-5 h-5" /> Warehouse
        </button>
      </div>

      <!-- Status Messages -->
      <div v-if="isSaving" class="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
        <Loader2Icon class="w-5 h-5 animate-spin" /> Saving settings...
      </div>

      <div v-if="saveSuccess" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
        <CheckCircleIcon class="w-5 h-5" /> Settings saved successfully!
      </div>

      <div v-if="saveError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
        <XCircleIcon class="w-5 h-5" /> {{ saveError }}
      </div>

      <!-- CONTENT -->
      <div class="space-y-6">

        <!-- General -->
        <div v-if="activeTab === 'general'">
          <div :class="cardClass" :style="cardStyle" class="border-l-2 border-red-600">

            <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
              <UserCogIcon class="w-5 h-5" /> General Settings
            </h2>

            <div class="space-y-4">
              <div class="flex items-center gap-2">
                <UserIcon class="w-5 h-5 text-gray-500" />
                <input v-model="settings.general.companyName" class="w-full border rounded px-4 py-2" placeholder="Company Name" />
              </div>
              <div class="flex items-center gap-2">
                <MailIcon class="w-5 h-5 text-gray-500" />
                <input v-model="settings.general.companyEmail" class="w-full border rounded px-4 py-2" placeholder="Company Email" />
              </div>
              <div class="flex items-center gap-2">
                <PhoneIcon class="w-5 h-5 text-gray-500" />
                <input v-model="settings.general.phone" class="w-full border rounded px-4 py-2" placeholder="Phone Number" />
              </div>

              <div class="flex items-center gap-2">
                <GlobeIcon class="w-5 h-5 text-gray-500" />
                <select v-model="settings.general.language" class="w-full border rounded px-4 py-2">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div class="flex items-center gap-2">
                <MoonIcon class="w-5 h-5 text-gray-500" />
                <select v-model="settings.general.theme" class="w-full border rounded px-4 py-2">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <button @click="saveSettings" class="bg-blue-600 text-white px-6 py-2 rounded flex items-center gap-2">
                <SaveIcon class="w-5 h-5" /> Save General Settings
              </button>
            </div>
          </div>
        </div>

        <!-- Inventory -->
        <div v-if="activeTab === 'inventory'">
          <div :class="cardClass" :style="cardStyle" class="border-l-2 border-red-600">

            <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
              <PackageIcon class="w-5 h-5" /> Inventory Settings
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="number" v-model.number="settings.inventory.lowStockThreshold" class="border rounded px-4 py-2" placeholder="Low Stock Threshold" />
              <input type="number" v-model.number="settings.inventory.minReorderQty" class="border rounded px-4 py-2" placeholder="Min Reorder Qty" />
              <input type="number" v-model.number="settings.inventory.defaultReorderQty" class="border rounded px-4 py-2" placeholder="Default Reorder Qty" />
              <input type="number" v-model.number="settings.inventory.stockCheckInterval" class="border rounded px-4 py-2" placeholder="Stock Check Interval" />
            </div>

            <label class="flex items-center mt-4 gap-2">
              <RefreshCcwIcon class="w-5 h-5" />
              <input type="checkbox" v-model="settings.inventory.autoReorder" class="mr-2" />
              Enable Auto Reorder
            </label>

            <button @click="saveSettings" class="mt-4 bg-blue-600 text-white px-6 py-2 rounded flex items-center gap-2">
              <SaveIcon class="w-5 h-5" /> Save Inventory Settings
            </button>
          </div>
        </div>

        <!-- Notifications -->
        <div v-if="activeTab === 'notifications'">
          <div :class="cardClass" :style="cardStyle" class="border-l-2 border-red-600">

            <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
              <BellRingIcon class="w-5 h-5" /> Notification Settings
            </h2>

            <div v-for="(label, key) in notificationLabels" :key="key" class="flex justify-between p-4 bg-gray-50 rounded mb-2">
              <span>{{ label }}</span>
              <input type="checkbox" v-model="settings.notifications[key]" />
            </div>

            <button @click="saveSettings" class="mt-4 bg-blue-600 text-white px-6 py-2 rounded flex items-center gap-2">
              <SaveIcon class="w-5 h-5" /> Save Notification Settings
            </button>
          </div>
        </div>

        <!-- Warehouse -->
        <div v-if="activeTab === 'warehouse'">
          <div :class="cardClass" :style="cardStyle" class="border-l-2 border-red-600">

            <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
              <MapPinIcon class="w-5 h-5" /> Warehouse Locations
            </h2>

            <div v-for="(wh, i) in settings.warehouse.locations" :key="i" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <input v-model="wh.name" class="border rounded px-3 py-2" placeholder="Name" />
              <input v-model="wh.location" class="border rounded px-3 py-2" placeholder="Location" />
              <div class="flex gap-2">
                <input v-model.number="wh.capacity" type="number" class="border rounded px-3 py-2 w-full" placeholder="Capacity" />
                <button @click="removeWarehouse(i)" class="bg-red-600 text-white px-3 rounded flex items-center gap-1">
                  <Trash2Icon class="w-4 h-4" /> X
                </button>
              </div>
            </div>

            <button @click="addWarehouse" class="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
              <PlusIcon class="w-4 h-4" /> Add Warehouse
            </button>

            <button @click="saveSettings" class="ml-2 bg-blue-600 text-white px-6 py-2 rounded flex items-center gap-2">
              <SaveIcon class="w-5 h-5" /> Save Warehouse Settings
            </button>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";

import { useRouter } from "vue-router";
import { auth, db } from "../../Firebase/Firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Topbar from "../../components/Topbar.vue";

// Valid Lucide icons
import { 
  SettingsIcon, LogOutIcon, UserIcon, PackageIcon, BellIcon, MapPinIcon,
  UserCogIcon, MailIcon, PhoneIcon, GlobeIcon, MoonIcon, SaveIcon,
  RefreshCcwIcon, BellRingIcon, Trash2Icon, PlusIcon, Loader2Icon,
  CheckCircleIcon, XCircleIcon
} from "lucide-vue-next";

const router = useRouter();
const activeTab = ref("general");
const isLoading = ref(true);
const isSaving = ref(false);
const saveSuccess = ref(false);
const saveError = ref(null);
const currentUser = ref(null);

const defaultSettings = {
  general: { companyName: "", companyEmail: "", phone: "", language: "en", theme: "light" },
  inventory: { lowStockThreshold: 50, minReorderQty: 100, defaultReorderQty: 500, stockCheckInterval: 7, autoReorder: true },
  notifications: { emailNotifications: true, lowStockAlerts: true, reorderNotifications: true, systemUpdates: true },
  warehouse: { locations: [] },
};

const settings = ref(JSON.parse(JSON.stringify(defaultSettings)));

const notificationLabels = {
  emailNotifications: "Email Notifications",
  lowStockAlerts: "Low Stock Alerts",
  reorderNotifications: "Reorder Notifications",
  systemUpdates: "System Updates",
};

const themeClass = computed(() =>
  settings.value.general.theme === "dark"
    ? "text-white"
    : "bg-gray-100 text-gray-900"
);

const themeStyle = computed(() =>
  settings.value.general.theme === "dark"
    ? { backgroundColor: '#232323' }
    : {}
);

const cardClass = computed(() =>
  settings.value.general.theme === "dark"
    ? "p-6 rounded shadow"
    : "bg-white p-6 rounded shadow"
);

const cardStyle = computed(() =>
  settings.value.general.theme === "dark"
    ? { backgroundColor: '#2a2a2a' }
    : {}
);


// Apply theme globally
const applyTheme = (theme) => {
  const html = document.documentElement;
  html.classList.remove('dark', 'light');
  
  if (theme === 'dark') {
    html.classList.add('dark');
  } else if (theme === 'light') {
    html.classList.add('light');
  } else if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      html.classList.add('dark');
    } else {
      html.classList.add('light');
    }
  }
  localStorage.setItem('appTheme', theme);
};

const saveSettings = async () => {
  isSaving.value = true;
  await setDoc(doc(db, "users", currentUser.value.uid, "settings", "preferences"), settings.value);
  isSaving.value = false;
  saveSuccess.value = true;
  setTimeout(() => (saveSuccess.value = false), 3000);
};


const addWarehouse = () => {
  settings.value.warehouse.locations.push({ name: "", location: "", capacity: 0 });
};

const removeWarehouse = (i) => {
  settings.value.warehouse.locations.splice(i, 1);
};

const logout = async () => {
  await signOut(auth);
  router.push("/");
};

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (!user) return router.push("/");
    currentUser.value = user;
    const snap = await getDoc(doc(db, "users", user.uid, "settings", "preferences"));
    if (snap.exists()) {
      settings.value = snap.data();
      // Apply loaded theme
      applyTheme(settings.value.general.theme);
    }
    isLoading.value = false;
  });
});

// Watch for theme changes and apply immediately
watch(() => settings.value.general.theme, (newTheme) => {
  applyTheme(newTheme);
});


const tabClass = (tab) =>
  activeTab.value === tab
    ? "text-blue-600 border-b-2 border-blue-600"
    : "text-gray-600";
</script>
