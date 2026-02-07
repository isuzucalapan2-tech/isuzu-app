<template>
  <div v-if="!isLoading" :class="themeClass" :style="themeStyle" class="h-screen flex flex-col">


    <!-- Sticky Topbar -->
    <div class="sticky top-0 z-50">
      <Topbar />
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto p-6">
      <h1 :class="textClass" class="text-3xl font-bold mb-6 border-l-4 border-red-600 pl-4 flex items-center gap-2">

        <LayoutDashboard class="w-7 h-7 text-red-600" />
        Dashboard
      </h1>

      <!-- Inventory Summary -->
      <div class="mb-8">
        <h2 :class="textClass" class="text-2xl font-bold mb-4 flex items-center gap-2">

          <Boxes class="w-6 h-6 text-red-600" />
          Inventory Summary
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Total Parts -->
          <div :class="cardClass" :style="cardStyle" class="shadow rounded-lg p-6 border-l-2 border-red-600 flex items-center gap-4">

            <Package class="w-10 h-10 text-gray-600" />
            <div>
              <h3 :class="subTextClass" class="text-sm">Total Parts</h3>
              <p :class="textClass" class="text-3xl font-bold">{{ inventoryItems.length }}</p>
            </div>
          </div>

          <!-- In Stock -->
          <div :class="cardClass" :style="cardStyle" class="shadow rounded-lg p-6 border-l-2 border-red-600 flex items-center gap-4">

            <CheckCircle class="w-10 h-10 text-green-600" />
            <div>
              <h3 class="text-sm text-green-600">In Stock</h3>
              <p class="text-3xl font-bold text-green-600">{{ inStock }}</p>
            </div>
          </div>

          <!-- Low Stock -->
          <div :class="cardClass" :style="cardStyle" class="shadow rounded-lg p-6 border-l-2 border-red-600 flex items-center gap-4">

            <AlertTriangle class="w-10 h-10 text-yellow-600" />
            <div>
              <h3 class="text-sm text-yellow-600">Low Stock</h3>
              <p class="text-3xl font-bold text-yellow-600">{{ lowStock }}</p>
            </div>
          </div>

          <!-- Out of Stock -->
          <div :class="cardClass" :style="cardStyle" class="shadow rounded-lg p-6 border-l-2 border-red-600 flex items-center gap-4">

            <XCircle class="w-10 h-10 text-red-600" />
            <div>
              <h3 class="text-sm text-red-600">Out of Stock</h3>
              <p class="text-3xl font-bold text-red-600">{{ outOfStock }}</p>
            </div>
          </div>

        </div>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- Status Chart -->
        <div :class="cardClass" :style="cardStyle" class="shadow rounded-lg p-6 border-t-2 border-red-600">

          <h2 :class="textClass" class="text-xl font-bold mb-4 flex items-center gap-2">
            <PieChart class="w-6 h-6 text-red-600" />
            Inventory Status
          </h2>

          <div class="chart-wrapper">
            <canvas ref="statusChart"></canvas>
          </div>
        </div>

        <!-- Category Chart -->
        <div :class="cardClass" :style="cardStyle" class="shadow rounded-lg p-6 border-t-2 border-red-600">

          <h2 :class="textClass" class="text-xl font-bold mb-4 flex items-center gap-2">
            <BarChart3 class="w-6 h-6 text-red-600" />
            Inventory by Category
          </h2>

          <div class="chart-wrapper">
            <canvas ref="categoryChart"></canvas>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from "vue";
import { useRouter } from "vue-router";
import { auth, db } from "../../Firebase/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import Topbar from "../../components/Topbar.vue";

// Theme detection
const isDarkMode = computed(() => {
  return document.documentElement.classList.contains('dark');
});

const themeClass = computed(() => 
  isDarkMode.value ? 'text-white' : 'bg-gray-100 text-gray-900'
);

const themeStyle = computed(() => 
  isDarkMode.value ? { backgroundColor: '#232323' } : {}
);

const cardClass = computed(() => 
  isDarkMode.value ? 'text-white' : 'bg-white text-gray-900'
);

const cardStyle = computed(() => 
  isDarkMode.value ? { backgroundColor: '#2a2a2a' } : {}
);


const textClass = computed(() => 
  isDarkMode.value ? 'text-white' : 'text-gray-800'
);

const subTextClass = computed(() => 
  isDarkMode.value ? 'text-gray-300' : 'text-gray-600'
);


/* 🔥 Lucide Icons */
import {
  LayoutDashboard,
  Boxes,
  Package,
  CheckCircle,
  AlertTriangle,
  XCircle,
  PieChart,
  BarChart3,
} from "lucide-vue-next";

/* Chart.js */
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const router = useRouter();
const isLoading = ref(true);
const inventoryItems = ref([]);

const statusChart = ref(null);
const categoryChart = ref(null);

let statusChartInstance = null;
let categoryChartInstance = null;

/* ===== COUNTS ===== */
const inStock = computed(() =>
  inventoryItems.value.filter(i => i.status === "in-stock").length
);
const lowStock = computed(() =>
  inventoryItems.value.filter(i => i.status === "low").length
);
const outOfStock = computed(() =>
  inventoryItems.value.filter(i => i.status === "out").length
);

/* ===== LOAD INVENTORY ===== */
const loadInventory = async (uid) => {
  const snapshot = await getDocs(collection(db, "users", uid, "inventory"));
  inventoryItems.value = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

/* ===== INIT CHARTS ===== */
const initCharts = () => {
  if (!statusChart.value || !categoryChart.value) return;

  statusChartInstance?.destroy();
  categoryChartInstance?.destroy();

  statusChartInstance = new Chart(statusChart.value, {
    type: "doughnut",
    data: {
      labels: ["In Stock", "Low Stock", "Out of Stock"],
      datasets: [
        {
          data: [inStock.value, lowStock.value, outOfStock.value],
          backgroundColor: ["#22c55e", "#eab308", "#ef4444"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
    },
  });

  const categories = {};
  inventoryItems.value.forEach(item => {
    const cat = item.category || "Uncategorized";
    categories[cat] = (categories[cat] || 0) + (item.quantity || 0);
  });

  categoryChartInstance = new Chart(categoryChart.value, {
    type: "bar",
    data: {
      labels: Object.keys(categories),
      datasets: [
        {
          label: "Total Quantity",
          data: Object.values(categories),
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } },
    },
  });
};

/* ===== AUTH ===== */
onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      router.push("/");
      return;
    }

    await loadInventory(user.uid);
    isLoading.value = false;
    await nextTick();
    initCharts();
  });
});
</script>

<style scoped>
.chart-wrapper {
  position: relative;
  height: 320px;
  width: 100%;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
