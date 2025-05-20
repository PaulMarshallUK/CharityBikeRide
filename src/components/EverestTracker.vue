<template>
  <div>
    <!-- Progress Overview -->
    <div class="bg-white shadow-lg rounded-lg p-4 md:p-6 mb-4 md:mb-8">
      <div class="flex flex-col md:flex-row md:space-x-6">
        <div class="flex-1 mb-4 md:mb-0">
          <h2
            class="text-xl font-semibold text-[#005eb8] mb-3 md:mb-4 flex items-center"
          >
            <i class="fas fa-chart-line mr-2 md:mr-3 text-[#22ABE2]"></i>
            Progress overview
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div class="bg-[#22ABE2] bg-opacity-10 p-3 md:p-4 rounded-lg">
              <p class="text-xs md:text-sm text-gray-600 flex items-center">
                <i class="fas fa-road mr-2"></i>
                Distance covered
              </p>
              <p class="text-xl md:text-2xl font-bold text-[#005eb8]">
                {{ totalDistance.toFixed(1) }} / {{ targetMiles }} miles
              </p>
              <div
                class="w-full bg-gray-200 h-2 md:h-3 rounded-full mt-2 overflow-hidden"
              >
                <div
                  class="bg-[#22ABE2] h-full rounded-full transition-all duration-700"
                  :style="{
                    width: `${Math.min((totalDistance / targetMiles) * 100, 100)}%`,
                  }"
                ></div>
              </div>
              <p class="text-xs md:text-sm text-gray-600 mt-1 md:mt-2">
                {{ ((totalDistance / targetMiles) * 100).toFixed(1) }}% complete
              </p>
            </div>

            <div class="bg-[#F49131] bg-opacity-10 p-3 md:p-4 rounded-lg">
              <p class="text-xs md:text-sm text-gray-600 flex items-center">
                <i class="fas fa-mountain mr-2"></i>
                Elevation gained
              </p>
              <p class="text-xl md:text-2xl font-bold text-[#005eb8]">
                {{ totalElevation.toLocaleString() }} / 29,032 ft
              </p>
              <div
                class="w-full bg-gray-200 h-2 md:h-3 rounded-full mt-2 overflow-hidden"
              >
                <div
                  class="bg-[#F49131] h-full rounded-full transition-all duration-700"
                  :style="{
                    width: `${Math.min((totalElevation / 29032) * 100, 100)}%`,
                  }"
                ></div>
              </div>
              <p class="text-xs md:text-sm text-gray-600 mt-1 md:mt-2">
                {{ ((totalElevation / 29032) * 100).toFixed(1) }}% of Everest
              </p>
            </div>

            <div class="bg-[#FFC72C] bg-opacity-10 p-3 md:p-4 rounded-lg">
              <p class="text-xs md:text-sm text-gray-600 flex items-center">
                <i class="fas fa-clock mr-2"></i>
                Time invested
              </p>
              <p class="text-xl md:text-2xl font-bold text-[#005eb8]">
                {{ formatTime(totalDuration) }}
              </p>
              <p class="text-xs md:text-sm text-gray-600 mt-1 md:mt-2">
                Across {{ rides.length }} rides
              </p>
              <p class="text-xs text-gray-500">
                Mostly as the sun comes up! ☀️
              </p>
            </div>

            <div class="bg-[#004467] bg-opacity-10 p-3 md:p-4 rounded-lg">
              <p class="text-xs md:text-sm text-gray-600 flex items-center">
                <i class="fas fa-donate mr-2"></i>
                Personal sponsorship
              </p>
              <p class="text-xl md:text-2xl font-bold text-[#005eb8]">
                £{{ (totalDistance * 0.1).toFixed(2) }}
              </p>
              <p class="text-xs md:text-sm text-gray-600 mt-1 md:mt-2">
                10p per mile
              </p>
              <p class="text-xs text-gray-500">Self-sponsored contribution</p>
            </div>
          </div>
        </div>

        <div class="flex-1 mt-4 md:mt-0">
          <h2
            class="text-xl font-semibold text-[#005eb8] mb-3 md:mb-4 flex items-center"
          >
            <i class="fas fa-flag-checkered mr-2 md:mr-3 text-[#F49131]"></i>
            Estimated completion
          </h2>
          <div
            class="bg-gradient-to-br from-[#005eb8] to-[#22ABE2] p-4 md:p-6 rounded-lg mb-3 md:mb-4 text-white"
          >
            <p class="text-xs md:text-sm">At current pace I'll reach:</p>
            <p class="text-xl md:text-2xl font-bold">
              {{ estimatedTotalDistance.toFixed(0) }} miles
            </p>
            <p class="text-lg md:text-xl font-semibold">
              {{ estimatedTotalElevation.toLocaleString() }} ft
            </p>
            <p class="text-lg md:text-xl font-semibold">
              {{ ((estimatedTotalElevation / 29032) * 100).toFixed(1) }}% of
              Mount Everest
            </p>
            <p class="text-xs md:text-sm mt-2 md:mt-3">
              {{
                estimatedTotalElevation >= 29032
                  ? `🎉 Summit reached! Exceeding by ${((estimatedTotalElevation / 29032 - 1) * 100).toFixed(1)}%`
                  : `${Math.ceil((29032 - totalElevation) / averageElevationPerRide)} more rides needed to reach the summit`
              }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-3 md:gap-4">
            <div class="bg-gray-50 p-3 md:p-4 rounded-lg text-center">
              <p class="text-xs md:text-sm text-gray-600">
                <i class="fas fa-tachometer-alt mr-1 md:mr-2"></i>
                Avg. speed
              </p>
              <p class="text-lg md:text-xl font-bold text-[#005eb8]">
                {{
                  totalDuration > 0
                    ? (totalDistance / (totalDuration / 60)).toFixed(1)
                    : 0
                }}
                mph
              </p>
            </div>
            <div class="bg-gray-50 p-3 md:p-4 rounded-lg text-center">
              <p class="text-xs md:text-sm text-gray-600">
                <i class="fas fa-calendar-check mr-1 md:mr-2"></i>
                Days remaining
              </p>
              <p class="text-lg md:text-xl font-bold text-[#005eb8]">
                {{ daysRemaining }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Combined Distance & Elevation Chart -->
    <div class="bg-white shadow-lg rounded-lg p-4 md:p-6 mb-4 md:mb-8">
      <h2
        class="text-xl font-semibold text-[#005eb8] mb-3 md:mb-4 flex items-center"
      >
        <i class="fas fa-chart-area mr-2 md:mr-3 text-[#22ABE2]"></i>
        Progress chart
      </h2>
      <!-- Chart container -->
      <div class="relative w-full h-64 md:h-96">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>

    <!-- Ride Log -->
    <div class="bg-white shadow-lg rounded-lg p-4 md:p-6 mb-4 md:mb-8">
      <h2
        class="text-xl font-semibold text-[#005eb8] mb-3 md:mb-4 flex items-center"
      >
        <i class="fas fa-list mr-2 md:mr-3 text-[#F49131]"></i>
        Ride log
      </h2>
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="bg-gradient-to-r from-[#005eb8] to-[#22ABE2] text-white">
              <th class="py-2 px-2 md:py-3 md:px-4 text-left rounded-tl-lg">
                Date
              </th>
              <th class="py-2 px-2 md:py-3 md:px-4 text-left">Time</th>
              <th class="py-2 px-2 md:py-3 md:px-4 text-right">Distance</th>
              <th class="py-2 px-2 md:py-3 md:px-4 text-right">Elevation</th>
              <th class="py-2 px-2 md:py-3 md:px-4 text-right">Duration</th>
              <th class="py-2 px-2 md:py-3 md:px-4 text-left rounded-tr-lg">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(ride, index) in sortedRides"
              :key="index"
              class="border-b border-gray-200 hover:bg-[#22ABE2] hover:bg-opacity-5 transition-colors"
            >
              <td class="py-2 px-2 md:py-3 md:px-4 whitespace-nowrap">
                <i class="fas fa-calendar-day mr-1 md:mr-2 text-[#22ABE2]"></i>
                {{ formatDate(ride.date) }}
              </td>
              <td class="py-2 px-2 md:py-3 md:px-4 whitespace-nowrap">
                <i class="fas fa-sun mr-1 md:mr-2 text-[#FFC72C]"></i>
                {{ ride.startTime }}
              </td>
              <td
                class="py-2 px-2 md:py-3 md:px-4 text-right whitespace-nowrap"
              >
                {{ ride.distance.toFixed(2) }} mi
              </td>
              <td
                class="py-2 px-2 md:py-3 md:px-4 text-right whitespace-nowrap"
              >
                {{ ride.elevation.toLocaleString() }} ft
              </td>
              <td
                class="py-2 px-2 md:py-3 md:px-4 text-right whitespace-nowrap"
              >
                {{ formatTime(ride.duration) }}
              </td>
              <td class="py-2 px-2 md:py-3 md:px-4">
                <span class="text-gray-600 italic text-sm md:text-base">{{
                  ride.note || "-"
                }}</span>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="bg-gray-100 font-semibold">
              <td class="py-2 px-2 md:py-3 md:px-4 rounded-bl-lg" colspan="2">
                Total
              </td>
              <td class="py-2 px-2 md:py-3 md:px-4 text-right">
                {{ totalDistance.toFixed(2) }} mi
              </td>
              <td class="py-2 px-2 md:py-3 md:px-4 text-right">
                {{ totalElevation.toLocaleString() }} ft
              </td>
              <td class="py-2 px-2 md:py-3 md:px-4 text-right">
                {{ formatTime(totalDuration) }}
              </td>
              <td class="py-2 px-2 md:py-3 md:px-4 rounded-br-lg"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- E-Bike Explanation Section -->
    <div class="bg-white shadow-lg rounded-lg p-4 md:p-6">
      <h2
        class="text-xl font-semibold text-[#005eb8] mb-3 md:mb-4 flex items-center"
      >
        <i class="fas fa-bolt mr-2 md:mr-3 text-[#F49131]"></i>
        An e-bike! Isn't that cheating!?!
      </h2>
      <p class="text-gray-600 mb-4">
        Well yes a bit, but it's all I've got! But seriously, studies have shown
        that e-bike riders still have to put in 60-80% of the effort they would
        need to normally, and those are some steep hills I'm climbing! I could
        do with some oxygen myself!
      </p>
      <p class="text-gray-600">
        If you're still not convinced, why not put in 60-80% of what you would
        have donated on a normal bike. I'm sponsoring myself at 10p a mile, so
        you could do 6-8p a mile, which at my current total would be just
        <span class="font-semibold text-[#005eb8]"
          >£{{ (totalDistance * 0.06).toFixed(2) }}-£{{
            (totalDistance * 0.08).toFixed(2)
          }}</span
        >!
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";

const targetMiles = 224;

// Ride data
const rides = ref([
  {
    date: "2025-05-03",
    startTime: "6:28am",
    duration: 47.38,
    distance: 9.3,
    elevation: 896,
    note: "Was colder than it looked!",
  },
  {
    date: "2025-05-04",
    startTime: "6:20am",
    duration: 66.12,
    distance: 13.98,
    elevation: 1450,
    note: "Got dive bombed by a pheasant!",
  },
  {
    date: "2025-05-05",
    startTime: "6.20am",
    duration: 69.23,
    distance: 15.82,
    elevation: 1739,
    note: "Saw a cow that had climbed up on a rock!",
  },
  {
    date: "2025-05-07",
    startTime: "5:01am",
    duration: 76.45,
    distance: 15.79,
    elevation: 1726,
    note: "Had a race with a squirrel!",
  },
  {
    date: "2025-05-09",
    startTime: "5:06am",
    duration: 75.25,
    distance: 15.8,
    elevation: 1726,
    note: "Saw 3 deers!",
  },
  {
    date: "2025-05-10",
    startTime: "5:37am",
    duration: 73.9,
    distance: 15.8,
    elevation: 1765,
    note: "Loads of rabbits!",
  },
  {
    date: "2025-05-11",
    startTime: "6:04am",
    duration: 73.25,
    distance: 15.8,
    elevation: 1716,
    note: "Sheep on the road!",
  },
  {
    date: "2025-05-13",
    startTime: "5:10am",
    duration: 75.05,
    distance: 15.79,
    elevation: 1732,
    note: "Nearly roadkilled some breakfast!",
  },
  {
    date: "2025-05-15",
    startTime: "5:04am",
    duration: 75.25,
    distance: 15.81,
    elevation: 1775,
    note: "It's a bit windy!",
  },
  {
    date: "2025-05-16",
    startTime: "5:07am",
    duration: 75.8,
    distance: 15.81,
    elevation: 1739,
    note: "4 deers! 4!",
  },
  {
    date: "2025-05-17",
    startTime: "5:49am",
    duration: 76.02,
    distance: 15.8,
    elevation: 1742,
    note: "11 deers! (I feel like Count von Count)",
  },
  {
    date: "2025-05-19",
    startTime: "5:16am",
    duration: 73.05,
    distance: 15.81,
    elevation: 1749,
    note: "RAF flypast!",
  },
  {
    date: "2025-05-20",
    startTime: "5:07am",
    duration: 73.1,
    distance: 15.81,
    elevation: 1768,
    note: "Cold and foggy!",
  },
]);

// Chart reference
const chartCanvas = ref(null);
let chart = null;

// Computed properties
const totalDistance = computed(() =>
  rides.value.reduce((sum, ride) => sum + ride.distance, 0),
);
const totalElevation = computed(() =>
  rides.value.reduce((sum, ride) => sum + ride.elevation, 0),
);
const totalDuration = computed(() =>
  rides.value.reduce((sum, ride) => sum + ride.duration, 0),
);
const averageElevationPerRide = computed(
  () => totalElevation.value / rides.value.length,
);

const sortedRides = computed(() =>
  [...rides.value].sort((a, b) => new Date(b.date) - new Date(a.date)),
);

const daysRemaining = computed(() => {
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return lastDay.getDate() - today.getDate();
});

const estimatedTotalDistance = computed(() => {
  const daysElapsed = new Date().getDate();
  const dailyAverage = totalDistance.value / daysElapsed;
  return totalDistance.value + dailyAverage * daysRemaining.value;
});

const estimatedTotalElevation = computed(() => {
  const daysElapsed = new Date().getDate();
  const dailyAverage = totalElevation.value / daysElapsed;
  return totalElevation.value + dailyAverage * daysRemaining.value;
});

// Functions
const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}:${mins.toString().padStart(2, "0")}`;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

// Create chart data for all days in month
const createChartData = () => {
  const today = new Date();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
  ).getDate();

  // Initialize arrays for all days
  const labels = [];
  const distanceData = [];
  const elevationData = [];
  const cumulativeDistance = [];
  const cumulativeElevation = [];

  let runningDistance = 0;
  let runningElevation = 0;

  // Create data for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    labels.push(day.toString());

    // Check if there's a ride on this day
    const dateStr = `2025-05-${day.toString().padStart(2, "0")}`;
    const ride = rides.value.find((r) => r.date === dateStr);

    if (ride) {
      distanceData.push(ride.distance);
      elevationData.push(ride.elevation);
      runningDistance += ride.distance;
      runningElevation += ride.elevation;
    } else {
      distanceData.push(0);
      elevationData.push(0);
    }

    cumulativeDistance.push(runningDistance);
    cumulativeElevation.push(runningElevation);
  }

  return {
    labels,
    distanceData,
    elevationData,
    cumulativeDistance,
    cumulativeElevation,
  };
};

// Initialize chart
const initChart = () => {
  if (!chartCanvas.value) return;

  const chartData = createChartData();

  chart = new Chart(chartCanvas.value, {
    type: "bar",
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label: "Daily Distance (mi)",
          data: chartData.distanceData,
          backgroundColor: "#22ABE2",
          borderColor: "#22ABE2",
          borderWidth: 1,
          yAxisID: "distance",
          order: 2,
        },
        {
          label: "Daily Elevation (ft)",
          data: chartData.elevationData,
          backgroundColor: "#F49131",
          borderColor: "#F49131",
          borderWidth: 1,
          yAxisID: "elevation",
          order: 2,
        },
        {
          label: "Cumulative Distance (mi)",
          data: chartData.cumulativeDistance,
          type: "line",
          borderColor: "#005eb8",
          backgroundColor: "rgba(0, 94, 184, 0.1)",
          borderWidth: 2,
          fill: true,
          yAxisID: "distance",
          order: 1,
        },
        {
          label: "Cumulative Elevation (ft)",
          data: chartData.cumulativeElevation,
          type: "line",
          borderColor: "#FFC72C",
          backgroundColor: "rgba(255, 199, 44, 0.1)",
          borderWidth: 2,
          fill: true,
          yAxisID: "elevation",
          order: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Day of May",
          },
          grid: {
            display: false,
          },
          ticks: {
            // Hide some day labels on small screens
            callback: function (value, index) {
              const screenWidth = window.innerWidth;
              if (screenWidth < 768) {
                return index % 3 === 0 ? this.getLabelForValue(value) : "";
              }
              return this.getLabelForValue(value);
            },
          },
        },
        distance: {
          type: "linear",
          position: "left",
          title: {
            display: true,
            text: "Distance (miles)",
          },
          beginAtZero: true,
          max: 250,
          ticks: {
            callback: function (value) {
              const screenWidth = window.innerWidth;
              if (screenWidth < 768) {
                // Show fewer ticks on mobile
                return value % 50 === 0 ? value : "";
              }
              return value;
            },
          },
        },
        elevation: {
          type: "linear",
          position: "right",
          title: {
            display: true,
            text: "Elevation (feet)",
          },
          beginAtZero: true,
          max: 35000,
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            callback: function (value) {
              const screenWidth = window.innerWidth;
              if (screenWidth < 768) {
                // Show fewer ticks on mobile
                return value % 10000 === 0 ? value.toLocaleString() : "";
              }
              return value.toLocaleString();
            },
          },
        },
      },
      plugins: {
        legend: {
          position: "top",
          labels: {
            // Make the legend more compact on mobile
            boxWidth: window.innerWidth < 768 ? 8 : 12,
            padding: window.innerWidth < 768 ? 8 : 10,
            font: {
              size: window.innerWidth < 768 ? 10 : 12,
            },
          },
        },
        tooltip: {
          callbacks: {
            title: (tooltipItems) => `May ${tooltipItems[0].label}`,
            label: (context) => {
              let label = context.dataset.label || "";
              if (label) {
                label += ": ";
              }
              if (context.dataset.yAxisID === "distance") {
                label += context.parsed.y.toFixed(1) + " mi";
              } else {
                label += context.parsed.y.toLocaleString() + " ft";
              }
              return label;
            },
          },
        },
      },
    },
  });
};

// Watch for data changes and update chart
watch(
  rides,
  () => {
    if (chart) {
      const chartData = createChartData();
      chart.data.labels = chartData.labels;
      chart.data.datasets[0].data = chartData.distanceData;
      chart.data.datasets[1].data = chartData.elevationData;
      chart.data.datasets[2].data = chartData.cumulativeDistance;
      chart.data.datasets[3].data = chartData.cumulativeElevation;
      chart.update();
    }
  },
  { deep: true },
);

// Handle window resize events for chart responsiveness
const handleResize = () => {
  if (chart) {
    chart.resize();
  }
};

onMounted(() => {
  initChart();
  window.addEventListener("resize", handleResize);
});
</script>
