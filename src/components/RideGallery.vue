<template>
  <div class="bg-white shadow-lg rounded-lg p-4 md:p-6 my-4 md:my-8">
    <h2 class="text-xl font-semibold text-[#005eb8] mb-3 md:mb-4 flex items-center">
      <i class="fas fa-images mr-2 md:mr-3 text-[#22ABE2]"></i>
      Ride gallery
    </h2>

    <!-- Mobile Swiper Gallery (Full Width) -->
    <div class="block md:hidden">
      <div class="swiper mobileSwiper" ref="mobileSwiper">
        <div class="swiper-wrapper">
          <div v-for="(image, index) in images" :key="index" class="swiper-slide">
            <a href="#" class="lightbox-link" @click.prevent="openLightbox(image)">
              <div class="relative overflow-hidden rounded-lg" :class="{'h-56': image.orientation === 'landscape', 'h-72': image.orientation === 'portrait'}">
                <img :src="image.src" :alt="image.caption"
                     class="w-full h-full object-cover rounded-lg shadow-md" />
                <div
                    v-if="image.caption"
                    class="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-sm">
                  {{ image.caption }}
                </div>
              </div>
            </a>
          </div>
        </div>
        <!-- Swiper controls (no pagination) -->
        <div class="swiper-button-prev mobile-nav-button"></div>
        <div class="swiper-button-next mobile-nav-button"></div>
      </div>
    </div>

    <!-- Desktop Swiper Gallery (3.5 images showing) -->
    <div class="hidden md:block">
      <div class="swiper desktopSwiper" ref="desktopSwiper">
        <div class="swiper-wrapper">
          <div v-for="(image, index) in images" :key="index" class="swiper-slide">
            <a href="#" class="lightbox-link" @click.prevent="openLightbox(image)">
              <div class="relative overflow-hidden rounded-lg" :class="{'h-48': image.orientation === 'landscape', 'h-64': image.orientation === 'portrait'}">
                <img :src="image.src" :alt="image.caption"
                     class="w-full h-full object-cover rounded-lg shadow-md" />
                <div
                    v-if="image.caption"
                    class="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-sm">
                  {{ image.caption }}
                </div>
              </div>
            </a>
          </div>
        </div>
        <!-- Desktop swiper controls -->
        <div class="swiper-button-prev desktop-nav-button"></div>
        <div class="swiper-button-next desktop-nav-button"></div>
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
        <div
            v-if="currentImage?.caption"
            class="absolute bottom-0 left-0 right-0 p-3 bg-black bg-opacity-70 text-white text-center">
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

// Swiper references
const mobileSwiper = ref(null);
const desktopSwiper = ref(null);

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
    // Initialize Mobile Swiper
    if (window.Swiper && mobileSwiper.value) {
      const mobileSwiperInstance = new window.Swiper('.mobileSwiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        navigation: {
          nextEl: '.mobileSwiper .swiper-button-next',
          prevEl: '.mobileSwiper .swiper-button-prev',
        },
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        }
      });
    }

    // Initialize Desktop Swiper
    if (window.Swiper && desktopSwiper.value) {
      const desktopSwiperInstance = new window.Swiper('.desktopSwiper', {
        slidesPerView: 3.5,
        spaceBetween: 20,
        loop: true,
        navigation: {
          nextEl: '.desktopSwiper .swiper-button-next',
          prevEl: '.desktopSwiper .swiper-button-prev',
        },
        breakpoints: {
          // When window width is >= 768px
          768: {
            slidesPerView: 3.5,
            spaceBetween: 20
          },
          // When window width is >= 1024px
          1024: {
            slidesPerView: 3.5,
            spaceBetween: 20
          },
          // When window width is >= 1280px
          1280: {
            slidesPerView: 3.5,
            spaceBetween: 20
          }
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
  margin-left: auto;
  margin-right: auto;
}

.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Mobile navigation buttons */
.mobile-nav-button:after {
  font-size: 20px !important;
}

.mobile-nav-button {
  width: 30px !important;
  height: 30px !important;
}

/* Desktop navigation buttons */
.desktop-nav-button:after {
  font-size: 24px !important;
}

.desktop-nav-button {
  width: 36px !important;
  height: 36px !important;
}

/* Override Swiper styles for better visibility */
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: #005eb8 !important;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  padding: 8px;
}

:deep(.swiper-button-prev) {
  left: 5px;
}

:deep(.swiper-button-next) {
  right: 5px;
}

/* Add hover effect */
:deep(.swiper-button-next:hover),
:deep(.swiper-button-prev:hover) {
  background-color: rgba(255, 255, 255, 0.9);
}
</style>