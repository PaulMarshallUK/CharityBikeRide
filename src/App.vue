<template>
  <div id="app" class="min-h-screen bg-gray-50 font-sans">
    <!-- Header -->
    <div class="bg-gradient-to-r from-[#005eb8] to-[#22ABE2] text-white py-6 px-4 md:py-8">
      <div class="max-w-6xl mx-auto text-center">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">The Big Move: Everest Challenge</h1>
        <p class="text-base sm:text-lg opacity-90">Climbing the equivalent of Mount Everest (29,032 ft) on a bicycle!</p>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-2 sm:px-4">
      <!-- Intro section -->
      <div class="bg-white shadow-lg rounded-lg p-4 sm:p-6 my-4 md:my-8">
        <h2 class="text-xl sm:text-2xl font-semibold text-[#005eb8] mb-4 flex items-center">
          <i class="fas fa-info-circle mr-3 text-[#22ABE2]"></i>
          About the challenge
        </h2>
        <p class="text-gray-600 mb-4">
          As part of our workplace charity fundraiser, "The Big Move", our team of 8 is aiming to collectively travel 1,000 miles during May.<br/>
          That's an average of 125 miles per person!<br/>
          But as I'm using an e-bike I've decided to up the challenge!
        </p>
        <p class="text-gray-600 mb-4">
          I've committed to doing double the distance and adding an extra dimension to the challenge - not just covering miles,
          but climbing the equivalent elevation of Mount Everest (29,032 ft) in the process!
        </p>
        <p class="text-gray-600">
          Follow my progress below as I tackle the early morning chill,
          battle wildlife encounters and early alarms!
        </p>
      </div>

      <!-- Main tracker component -->
      <div class="px-0 sm:px-4">
        <EverestTracker />
      </div>

      <!-- Outro section -->
      <div class="bg-white shadow-lg rounded-lg p-4 sm:p-6 my-4 md:my-8">
        <h2 class="text-xl sm:text-2xl font-semibold text-[#005eb8] mb-4 flex items-center">
          <i class="fas fa-heart mr-3 text-[#F49131]"></i>
          Support the cause!
        </h2>
        <p class="text-gray-600 mb-4">
          Every mile counts and every foot of elevation climbed brings us closer to our fundraising goal!
        </p>
        <p class="text-gray-600 mb-4">
          By the end of May,
          I'll have spent over 31 hours on my bike,
          travelled hundreds of miles,
          and climbed thousands of feet - all for a great cause.
        </p>
        <div class="bg-gradient-to-r from-[#FFC72C] to-[#F49131] bg-opacity-20 p-4 sm:p-6 rounded-lg">
          <p class="text-lg font-semibold text-[#004467] mb-3 flex items-center">
            <i class="fas fa-donate mr-3"></i>
            Want to Support?
          </p>
          <p class="text-gray-700 mb-4">
            Every contribution helps make a difference! I'm personally committing 10p per mile to the cause.
          </p>
          <a href="https://events.tchc.org.uk/fundraisers/UHTechTeam"
             target="_blank"
             class="inline-flex items-center bg-[#005eb8] hover:bg-[#004467] text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition duration-300">
            <i class="fas fa-external-link-alt mr-2"></i>
            Donate to our team
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import EverestTracker from './components/EverestTracker.vue'
</script>