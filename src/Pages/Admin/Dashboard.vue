<template>
  <div v-if="!isLoading" class="h-screen flex flex-col bg-gray-100">

    <!-- Sticky Topbar -->
    <div class="sticky top-0 z-50">
      <Topbar />
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto p-6">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>

      <!-- User Info -->
      <div class="mb-6">
        <p class="text-gray-800 font-medium">Welcome,</p>
        <p class="text-gray-800 font-bold">{{ userEmail }}</p>
      </div>

      <!-- Logout -->
      <button
        @click="logout"
        class="mb-6 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
      >
        Logout
      </button>

      <!-- Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-xl font-bold mb-2">Total Vehicles</h2>
          <p class="text-3xl font-bold text-gray-800">1,250</p>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-xl font-bold mb-2">Trucks</h2>
          <p class="text-3xl font-bold text-gray-800">450</p>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-xl font-bold mb-2">SUVs</h2>
          <p class="text-3xl font-bold text-gray-800">300</p>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-xl font-bold mb-2">Pickups</h2>
          <p class="text-3xl font-bold text-gray-800">500</p>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-xl font-bold mb-2">Available Stock</h2>
          <p class="text-3xl font-bold text-gray-800">1,100</p>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-xl font-bold mb-2">Sold Units</h2>
          <p class="text-3xl font-bold text-gray-800">150</p>
        </div>

      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-xl font-bold mb-4">Monthly Sales</h2>
          <canvas id="salesChart" class="w-full h-64"></canvas>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-xl font-bold mb-4">Inventory Distribution</h2>
          <canvas id="inventoryChart" class="w-full h-64"></canvas>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { auth } from "../../Firebase/Firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import Topbar from "../../components/Topbar.vue";

import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const router = useRouter();
const userEmail = ref("");
const isLoading = ref(true);

onMounted(() => {
  // Load and apply saved theme from localStorage
  const savedTheme = localStorage.getItem("appTheme");
  if (savedTheme) {
    applyTheme(savedTheme);
  }

  // Wait for Firebase to restore the user session
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    isLoading.value = false;
    if (user) {
      userEmail.value = user.email;
      setTimeout(initCharts, 100);
    } else {
      router.push("/");
    }
  });

  // Cleanup subscription on unmount
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

const logout = async () => {
  await signOut(auth);
  router.push("/");
};

const initCharts = () => {
  // Detect dark mode
  const isDarkMode = document.documentElement.classList.contains("dark");
  const textColor = isDarkMode ? "#f3f4f6" : "#1f2937";
  const gridColor = isDarkMode ? "#4b5563" : "#e5e7eb";
  const backgroundColor = isDarkMode ? "#2d3748" : "#ffffff";

  // Monthly Sales Chart
  const salesCtx = document.getElementById("salesChart");
  new Chart(salesCtx, {
    type: "line",
    data: {
      labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"],
      datasets: [
        {
          label: "Sales Units",
          data: [10,25,15,30,40,35,50,45],
          borderColor: "rgb(34,197,94)",
          backgroundColor: "rgba(34,197,94,0.2)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { 
        legend: { 
          display: true,
          labels: {
            color: textColor,
            font: { size: 14 }
          }
        }
      },
      scales: {
        y: {
          ticks: { color: textColor },
          grid: { color: gridColor }
        },
        x: {
          ticks: { color: textColor },
          grid: { color: gridColor }
        }
      }
    },
  });

  new Chart(document.getElementById("inventoryChart"), {
    type: "doughnut",
    data: {
      labels: ["Trucks","SUVs","Pickups"],
      datasets: [
        {
          data: [450,300,500],
          backgroundColor: [
            "rgb(59,130,246)",
            "rgb(16,185,129)",
            "rgb(234,179,8)",
          ],
          hoverOffset: 10,
        },
      ],
    },
    options: { 
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: textColor,
            font: { size: 14 }
          }
        }
      }
    },
  });
};
</script>
