<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="flex-1 p-6">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>

      <!-- User Info -->
      <div class="mb-6">
        <p class="text-gray-800 font-medium">Welcome,</p>
        <p class="text-gray-800 font-bold">{{ userEmail }}</p>
      </div>

      <!-- Logout Button -->
      <button
        @click="logout"
        class="mb-6 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
      >
        Logout
      </button>

      <!-- Inventory Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-xl font-bold mb-2">Total Vehicles</h2>
          <p class="text-3xl font-bold text-gray-800">1,250</p>
          <p class="text-gray-500 mt-1">Total Isuzu vehicles in inventory</p>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-xl font-bold mb-2">Trucks</h2>
          <p class="text-3xl font-bold text-gray-800">450</p>
          <p class="text-gray-500 mt-1">Heavy and light trucks</p>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-xl font-bold mb-2">SUVs</h2>
          <p class="text-3xl font-bold text-gray-800">300</p>
          <p class="text-gray-500 mt-1">Sport Utility Vehicles</p>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-xl font-bold mb-2">Pickups</h2>
          <p class="text-3xl font-bold text-gray-800">500</p>
          <p class="text-gray-500 mt-1">Isuzu pickup models</p>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-xl font-bold mb-2">Available Stock</h2>
          <p class="text-3xl font-bold text-gray-800">1,100</p>
          <p class="text-gray-500 mt-1">Vehicles ready for delivery</p>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-xl font-bold mb-2">Sold Units</h2>
          <p class="text-3xl font-bold text-gray-800">150</p>
          <p class="text-gray-500 mt-1">Units sold this month</p>
        </div>
      </div>

      <!-- Static Graphs -->
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
import { signOut } from "firebase/auth";
import Sidebar from "../../components/Sidebar.vue";

// Chart.js import
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const router = useRouter();
const userEmail = ref("");
const error = ref("");

// User check
onMounted(() => {
  const user = auth.currentUser;
  if (user) {
    userEmail.value = user.email;
  } else {
    router.push("/");
  }

  // Initialize charts
  initCharts();
});

// Logout
const logout = async () => {
  error.value = "";
  try {
    await signOut(auth);
    router.push("/");
  } catch (err) {
    error.value = "Failed to logout: " + err.message;
  }
};

// Chart initialization
const initCharts = () => {
  // Monthly Sales Chart
  const salesCtx = document.getElementById("salesChart");
  new Chart(salesCtx, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      datasets: [
        {
          label: "Sales Units",
          data: [10, 25, 15, 30, 40, 35, 50, 45],
          borderColor: "rgb(34,197,94)",
          backgroundColor: "rgba(34,197,94,0.2)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true } },
    },
  });

  // Inventory Distribution Chart
  const inventoryCtx = document.getElementById("inventoryChart");
  new Chart(inventoryCtx, {
    type: "doughnut",
    data: {
      labels: ["Trucks", "SUVs", "Pickups"],
      datasets: [
        {
          label: "Inventory",
          data: [450, 300, 500],
          backgroundColor: [
            "rgb(59,130,246)",
            "rgb(16,185,129)",
            "rgb(234,179,8)",
          ],
          hoverOffset: 10,
        },
      ],
    },
    options: { responsive: true },
  });
};
</script>

<style scoped>
body {
  font-family: "Inter", sans-serif;
}
</style>
