<template>
  <div class="bg-white shadow-lg rounded-lg p-4 md:p-6 mb-4 md:mb-8">
    <h2 class="text-xl font-semibold text-[#005eb8] mb-3 md:mb-4 flex items-center">
      <i class="fas fa-images mr-2 md:mr-3 text-[#22ABE2]"></i>
      Ride gallery
    </h2>

    <!-- Mobile Swiper Gallery -->
    <div class="block md:hidden">
      <div class="swiper mySwiper" ref="mobileSwiper">
        <div class="swiper-wrapper">
          <div v-for="(image, index) in images" :key="index" class="swiper-slide">
            <a href="#" class="lightbox-link" @click.prevent="openLightbox(image)">
              <div class="relative overflow-hidden rounded-lg" :class="{'h-64': image.orientation === 'landscape', 'h-80': image.orientation === 'portrait'}">
                <img :src="image.src" :alt="image.caption"
                     class="w-full h-full object-cover rounded-lg shadow-md" />
                <div class="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-sm">
                  {{ image.caption }}
                </div>
              </div>
            </a>
          </div>
        </div>
        <!-- Swiper controls -->
        <div class="swiper-pagination mt-4"></div>
        <div class="swiper-button-prev text-[#005eb8]"></div>
        <div class="swiper-button-next text-[#005eb8]"></div>
      </div>
    </div>

    <!-- Desktop Grid Gallery -->
    <div class="hidden md:grid grid-cols-3 gap-4">
      <div v-for="(image, index) in images" :key="index"
           class="block overflow-hidden rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
           @click="openLightbox(image)">
        <div class="relative" :class="{'h-48': image.orientation === 'landscape', 'h-64': image.orientation === 'portrait'}">
          <img :src="image.src" :alt="image.caption"
               class="w-full h-full object-cover rounded-lg shadow-md" />
          <div class="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-sm">
            {{ image.caption }}
          </div>
        </div>
      </div>
    </div>

    <!-- Gallery Info -->
    <p class="text-gray-600 text-sm mt-4 text-center">
      <i class="fas fa-info-circle mr-1"></i> Click any image to view in full size
    </p>

    <!-- Custom Lightbox -->
    <div v-if="lightboxOpen"
         class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
         @click="closeLightbox">
      <div class="relative max-w-4xl max-h-[90vh] overflow-hidden" @click.stop>
        <img :src="currentImage?.src" :alt="currentImage?.caption"
             class="max-w-full max-h-[80vh] object-contain rounded shadow-lg" />
        <div class="absolute bottom-0 left-0 right-0 p-3 bg-black bg-opacity-70 text-white text-center">
          {{ currentImage?.caption }}
        </div>
        <button @click="closeLightbox"
                class="absolute top-3 right-3 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { galleryImages } from '../data/images.js'

// Image data from external file
const images = ref(galleryImages);

// Mobile swiper reference
const mobileSwiper = ref(null);

// Lightbox state
const lightboxOpen = ref(false);
const currentImage = ref(null);

// Open lightbox
const openLightbox = (image) => {
  currentImage.value = image;
  lightboxOpen.value = true;
  document.body.style.overflow = 'hidden'; // Prevent scrolling
};

// Close lightbox
const closeLightbox = () => {
  lightboxOpen.value = false;
  document.body.style.overflow = ''; // Re-enable scrolling
};

// Setup event handlers
onMounted(() => {
  // Using setTimeout to ensure the DOM is fully rendered
  setTimeout(() => {
    // Initialize Swiper
    if (window.Swiper && mobileSwiper.value) {
      const swiperInstance = new window.Swiper('.mySwiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        }
      });
    }
  }, 500);

  // Add escape key handler for lightbox
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxOpen.value) {
      closeLightbox();
    }
  });
});
</script>

<style scoped>
.swiper {
  width: 100%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
}

.swiper-slide {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Override Swiper styles for better visibility */
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: #005eb8 !important;
  background-color: rgba(255, 255, 255, 0.7);
  width: 40px !important;
  height: 40px !important;
  border-radius: 50%;
  padding: 10px;
}

:deep(.swiper-pagination-bullet-active) {
  background-color: #005eb8 !important;
}
</style>