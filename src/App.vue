<template>
  <div id="app" class="min-h-screen bg-gray-50 font-sans">
    <!-- Header -->
    <div
      class="bg-gradient-to-r from-[#005eb8] to-[#22ABE2] text-white py-6 px-4 md:py-8"
    >
      <div class="max-w-6xl mx-auto text-center">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
          The Big Move: Everest Challenge
        </h1>
        <p class="text-base sm:text-lg opacity-90">
          Climbing the equivalent of Mount Everest on a bicycle!
        </p>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-2 sm:px-4">
      <!-- Intro section -->
      <div class="bg-white shadow-lg rounded-lg p-4 sm:p-6 my-4 md:my-8">
        <h2
          class="text-xl sm:text-2xl font-semibold text-[#005eb8] mb-4 flex items-center"
        >
          <i class="fas fa-info-circle mr-3 text-[#22ABE2]"></i>
          About the challenge
        </h2>
        <p class="text-gray-600 mb-4">
          As part of our workplace charity fundraiser for The Children's
          Hospital Charity, "The Big Move", our team of 9 is aiming to
          collectively travel 1,000 miles during May. That's an average of 112
          miles per person! But as I'm using a
          <span class="hidden">n e-</span>bike I've decided to up the challenge!
        </p>
        <p class="text-gray-600 mb-4">
          I've committed to doing double the distance and adding an extra
          dimension to the challenge - not just covering miles, but climbing the
          equivalent elevation of Mount Everest (29,032 ft) in the process!
        </p>
        <p class="text-gray-600">
          Follow my progress below as I tackle the early morning chill, battle
          wildlife encounters and early alarms!
        </p>
      </div>

      <!-- Main tracker component -->
      <div class="px-0">
        <EverestTracker />
      </div>

      <!-- Ride Gallery -->
      <RideGallery />

      <!-- Outro section -->
      <div
        id="support-section"
        class="bg-white shadow-lg rounded-lg p-4 sm:p-6 my-4 md:my-8"
      >
        <h2
          class="text-xl sm:text-2xl font-semibold text-[#005eb8] mb-4 flex items-center"
        >
          <i class="fas fa-heart mr-3 text-[#F49131]"></i>
          Support the cause!
        </h2>
        <p class="text-gray-600 mb-4">
          Every mile counts and every foot of elevation climbed brings us closer
          to our fundraising goal!
        </p>
        <p class="text-gray-600 mb-4">
          By the end of May, I'll have spent a whole day in the saddle,
          travelled hundreds of miles, and climbed thousands of feet - all for a
          great cause.
        </p>
        <div
          class="bg-gradient-to-r from-[#FFC72C] to-[#F49131] bg-opacity-20 p-4 sm:p-6 rounded-lg"
        >
          <p
            class="text-lg font-semibold text-[#004467] mb-3 flex items-center"
          >
            <i class="fas fa-donate mr-3"></i>
            Want to support?
          </p>
          <p class="text-gray-700 mb-4">
            Every contribution helps make a difference! I'm personally
            committing 10p per mile to the cause.
          </p>
          <a
            id="static-donate-btn"
            href="https://events.tchc.org.uk/fundraisers/UHTechTeam"
            target="_blank"
            class="inline-flex items-center bg-[#005eb8] hover:bg-[#004467] text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition duration-300 group"
          >
            <i
              class="fas fa-external-link-alt mr-2 group-hover:scale-110 transition-transform duration-200"
            ></i>
            Donate to our team
          </a>
        </div>
      </div>
    </div>

    <!-- Sticky Donation Banner -->
    <div
      id="sticky-banner"
      class="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
      v-show="showBanner"
    >
      <a
        href="https://events.tchc.org.uk/fundraisers/UHTechTeam"
        target="_blank"
        class="inline-flex items-center bg-[#005eb8] hover:bg-[#004467] text-white font-semibold py-2 sm:py-3 px-5 sm:px-6 rounded-lg shadow-lg hover:shadow-xl transition-opacity duration-300 group whitespace-nowrap"
        :class="{ 'opacity-0': isNearDonationSection }"
      >
        <div class="icon-container mr-3 relative overflow-hidden w-5 h-5">
          <i
            v-for="(icon, index) in donateIcons"
            :key="icon"
            :class="[`fas fa-${icon}`, { active: currentIconIndex === index }]"
            class="absolute inset-0 transition-transform duration-300"
          ></i>
          <i
            class="fas fa-external-link-alt absolute inset-0 transform translate-y-full transition-transform duration-300"
          ></i>
        </div>
        <span class="text-sm sm:text-base">Donate to our team</span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import EverestTracker from "./components/EverestTracker.vue";
import RideGallery from "./components/RideGallery.vue";

// Sticky banner functionality
const showBanner = ref(true); // Always show banner
const isNearDonationSection = ref(false); // Track if near donation section
const currentIconIndex = ref(0);
const donateIcons = ref([
  "bicycle",
  "mountain",
  "paw",
  "cloud-rain",
  "road",
  "donate",
]);

// Handle scroll to detect when near support section
const handleScroll = () => {
  const supportSection = document.getElementById("support-section");
  if (supportSection) {
    const rect = supportSection.getBoundingClientRect();
    // Check if the support section is visible on screen
    isNearDonationSection.value =
      rect.top <= window.innerHeight && rect.bottom >= 0;
  }
};

// Cycle through icons
const cycleIcons = () => {
  currentIconIndex.value =
    (currentIconIndex.value + 1) % donateIcons.value.length;
};

let iconInterval = null;

onMounted(() => {
  // Start icon cycling immediately
  iconInterval = setInterval(cycleIcons, 2000);

  // Add scroll listener
  window.addEventListener("scroll", handleScroll);

  // Initial state - banner visible, not near donation section
  showBanner.value = true;
  isNearDonationSection.value = false;
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  if (iconInterval) {
    clearInterval(iconInterval);
  }
});
</script>

<style scoped>
.icon-container .fas {
  transform: translateY(0);
}

.icon-container .fas:not(.active) {
  transform: translateY(-100%);
}

.icon-container .fas.active {
  transform: translateY(0);
}

/* Override the cycling behavior on hover */
.group:hover .icon-container .fas:not(.fa-external-link-alt) {
  transform: translateY(-100%) !important;
}

.group:hover .icon-container .fa-external-link-alt {
  transform: translateY(0) !important;
}
</style>
