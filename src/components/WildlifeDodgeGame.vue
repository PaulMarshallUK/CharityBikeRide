<template>
  <div class="w-full bg-white shadow-lg rounded-lg overflow-hidden">
    <div class="bg-gradient-to-r from-[#005eb8] to-[#22ABE2] text-white p-3 md:p-4">
      <h2 class="text-lg md:text-xl font-semibold flex items-center">
        <i class="fas fa-gamepad mr-2"></i>
        Wildlife Dodge Challenge
      </h2>
      <p class="text-sm md:text-base opacity-90">Dodge the wildlife you encounter on your rides!</p>
    </div>

    <div class="relative">
      <!-- Game container -->
      <div
          ref="mountRef"
          class="w-full h-64 md:h-80 lg:h-96 bg-gray-800"
      ></div>

      <!-- Loading screen -->
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
        <div class="text-center">
          <i class="fas fa-spinner fa-spin text-3xl text-[#005eb8] mb-2"></i>
          <p class="text-gray-700">Loading game...</p>
        </div>
      </div>

      <!-- Start screen -->
      <div v-if="!gameStarted && !loading" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="text-center bg-white p-4 md:p-6 rounded-lg shadow-lg">
          <h3 class="text-xl md:text-2xl font-bold text-[#005eb8] mb-2">Wildlife Dodge</h3>
          <p class="text-gray-600 mb-4">Dodge the animals you encounter on your Everest Challenge!</p>

          <p v-if="highScore > 0" class="text-sm font-medium text-gray-700 mb-3">
            High Score: {{ highScore }}
          </p>

          <button
              @click="startGame"
              class="bg-[#005eb8] hover:bg-[#004467] text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            <i class="fas fa-play mr-2"></i>
            Start Game
          </button>

          <div class="mt-4 text-sm text-gray-500">
            <p class="mb-1">
              <i class="fas fa-keyboard mr-1"></i>
              <span class="font-medium">Controls:</span>
            </p>
            <p>Arrow keys / A D to move left and right</p>
            <p>Or tap left/right side of screen</p>
          </div>
        </div>
      </div>

      <!-- Game over screen -->
      <div v-if="gameOver" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60">
        <div class="text-center bg-white p-4 md:p-6 rounded-lg shadow-lg">
          <h3 class="text-xl md:text-2xl font-bold text-[#F49131] mb-2">Wildlife Encounter!</h3>
          <p class="text-gray-600 mb-2">You got too close to the local wildlife!</p>

          <p class="text-lg font-bold text-[#005eb8] mb-1">Score: {{ score }}</p>

          <p v-if="score > highScore" class="text-sm font-medium text-[#F49131] mb-4">
            <i class="fas fa-trophy mr-1"></i>
            New High Score!
          </p>
          <p v-else class="text-sm font-medium text-gray-700 mb-4">
            High Score: {{ highScore }}
          </p>

          <button
              @click="restartGame"
              class="bg-[#22ABE2] hover:bg-[#005eb8] text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            <i class="fas fa-redo mr-2"></i>
            Try Again
          </button>

          <div class="mt-3 text-sm text-gray-500">
            <p>"Not as easy as it looks, is it?"</p>
          </div>
        </div>
      </div>

      <!-- HUD - Score display -->
      <div v-if="gameStarted && !gameOver" class="absolute top-2 left-2 right-2 flex justify-between">
        <div class="bg-[#005eb8] bg-opacity-80 text-white px-3 py-1 rounded-full">
          <span class="font-medium">Score: {{ score }}</span>
        </div>
        <div class="bg-[#005eb8] bg-opacity-80 text-white px-3 py-1 rounded-full">
          <span class="font-medium">High Score: {{ highScore }}</span>
        </div>
      </div>
    </div>

    <div class="p-3 md:p-4 bg-gray-50 border-t border-gray-200">
      <p class="text-sm text-gray-600">
        <i class="fas fa-info-circle mr-1 text-[#22ABE2]"></i>
        Inspired by your real wildlife encounters during the Everest Challenge!
        Watch out for deer, pheasants, rabbits, squirrels, and sheep.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WildlifeDodgeGame',

  data() {
    return {
      score: 0,
      gameOver: false,
      gameStarted: false,
      highScore: 0,
      loading: true,

      // Game parameters
      speed: 0.2,
      laneWidth: 2,
      bicycleLane: 1,
      obstacleSpawnTime: 0,
      animationFrameId: null,
      isGameOver: false,
      roadLength: 30,

      // Animal types
      animals: [
        { name: 'deer', scale: 0.5, color: 0x8B4513 },
        { name: 'rabbit', scale: 0.3, color: 0xA0A0A0 },
        { name: 'pheasant', scale: 0.4, color: 0xCD853F },
        { name: 'squirrel', scale: 0.25, color: 0x8B4513 },
        { name: 'sheep', scale: 0.6, color: 0xFFFFFF }
      ]
    };
  },

  // Move Three.js objects outside of data() to prevent Vue reactivity
  created() {
    // These will not be reactive - solving the proxy issue
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.bicycle = null;
    this.roadSegments = [];
    this.obstacles = [];
    this.clock = null;
  },

  mounted() {
    // Use a CDN version of Three.js to avoid module bundling issues
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.min.js';
    script.onload = () => {
      this.THREE = window.THREE;
      this.init();

      // Try to load high score from local storage
      try {
        const savedHighScore = localStorage.getItem('wildlifeDodgeHighScore');
        if (savedHighScore) {
          this.highScore = parseInt(savedHighScore);
        }
      } catch (e) {
        console.log('Could not load high score from localStorage');
      }

      // Add event listeners
      window.addEventListener('resize', this.handleResize);
      window.addEventListener('keydown', this.handleKeyDown);
      this.$refs.mountRef.addEventListener('touchstart', this.handleTouchStart);
    };
    script.onerror = () => {
      console.error('Failed to load Three.js');
      this.loading = false;
    };
    document.head.appendChild(script);
  },

  beforeUnmount() {
    // Clean up
    if (this.$refs.mountRef && this.renderer) {
      this.$refs.mountRef.removeChild(this.renderer.domElement);
    }

    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('keydown', this.handleKeyDown);

    if (this.$refs.mountRef) {
      this.$refs.mountRef.removeEventListener('touchstart', this.handleTouchStart);
    }

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Dispose of Three.js objects
    if (this.scene) {
      this.scene.traverse(object => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    }
  },

  methods: {
    init() {
      // Create scene
      this.scene = new this.THREE.Scene();
      this.scene.background = new this.THREE.Color(0x87CEEB); // Sky blue background

      // Create camera
      this.camera = new this.THREE.PerspectiveCamera(
          75,
          this.$refs.mountRef.clientWidth / this.$refs.mountRef.clientHeight,
          0.1,
          1000
      );
      this.camera.position.set(0, 3, 0);
      this.camera.rotation.x = -0.3;

      // Create renderer
      this.renderer = new this.THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(
          this.$refs.mountRef.clientWidth,
          this.$refs.mountRef.clientHeight
      );
      this.$refs.mountRef.appendChild(this.renderer.domElement);

      // Create clock for timing
      this.clock = new this.THREE.Clock();

      // Create lighting
      const ambientLight = new this.THREE.AmbientLight(0xffffff, 0.6);
      this.scene.add(ambientLight);

      const directionalLight = new this.THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(0, 10, 5);
      this.scene.add(directionalLight);

      // Create road
      this.createRoad();

      // Create bicycle
      this.createBicycle();

      // Add scenery
      this.addScenery();

      // Set loaded state
      this.loading = false;

      // Start animation loop
      this.animate();
    },

    createRoad() {
      // Create a long gray road
      const roadWidth = this.laneWidth * 3; // 3 lanes

      // Create multiple road segments for scrolling effect
      for (let i = 0; i < 5; i++) {
        const roadGeometry = new this.THREE.PlaneGeometry(roadWidth, this.roadLength);
        const roadMaterial = new this.THREE.MeshStandardMaterial({
          color: 0x333333,
          side: this.THREE.DoubleSide,
          roughness: 0.8
        });

        const roadSegment = new this.THREE.Mesh(roadGeometry, roadMaterial);
        roadSegment.rotation.x = -Math.PI / 2; // Rotate to be horizontal
        roadSegment.position.z = -this.roadLength / 2 - (i * this.roadLength);

        this.scene.add(roadSegment);
        this.roadSegments.push(roadSegment);

        // Add lane markings
        const leftLineGeometry = new this.THREE.PlaneGeometry(0.1, this.roadLength);
        const rightLineGeometry = new this.THREE.PlaneGeometry(0.1, this.roadLength);
        const lineMaterial = new this.THREE.MeshBasicMaterial({
          color: 0xFFFFFF,
          side: this.THREE.DoubleSide
        });

        const leftLine = new this.THREE.Mesh(leftLineGeometry, lineMaterial);
        leftLine.rotation.x = -Math.PI / 2;
        leftLine.position.x = -this.laneWidth / 2;
        leftLine.position.z = -this.roadLength / 2 - (i * this.roadLength);
        leftLine.position.y = 0.01; // Slightly above road

        const rightLine = new this.THREE.Mesh(rightLineGeometry, lineMaterial);
        rightLine.rotation.x = -Math.PI / 2;
        rightLine.position.x = this.laneWidth / 2;
        rightLine.position.z = -this.roadLength / 2 - (i * this.roadLength);
        rightLine.position.y = 0.01; // Slightly above road

        this.scene.add(leftLine);
        this.scene.add(rightLine);
      }

      // Create grass on the sides
      const grassGeometry = new this.THREE.PlaneGeometry(50, this.roadLength * 5);
      const grassMaterial = new this.THREE.MeshStandardMaterial({
        color: 0x567d46,
        side: this.THREE.DoubleSide,
        roughness: 1
      });

      const leftGrass = new this.THREE.Mesh(grassGeometry, grassMaterial);
      leftGrass.rotation.x = -Math.PI / 2;
      leftGrass.position.x = -(roadWidth / 2) - 25 / 2;
      leftGrass.position.z = -this.roadLength * 2.5;

      const rightGrass = new this.THREE.Mesh(grassGeometry, grassMaterial);
      rightGrass.rotation.x = -Math.PI / 2;
      rightGrass.position.x = roadWidth / 2 + 25 / 2;
      rightGrass.position.z = -this.roadLength * 2.5;

      this.scene.add(leftGrass);
      this.scene.add(rightGrass);
    },

    createBicycle() {
      // Create a simple bicycle representation
      const bicycleGroup = new this.THREE.Group();

      // Frame
      const frameGeometry = new this.THREE.BoxGeometry(0.1, 0.4, 0.8);
      const frameMaterial = new this.THREE.MeshStandardMaterial({ color: 0x005eb8 }); // Use your site's blue color
      const frame = new this.THREE.Mesh(frameGeometry, frameMaterial);
      frame.position.y = 0.4;
      bicycleGroup.add(frame);

      // Wheels
      const wheelGeometry = new this.THREE.TorusGeometry(0.3, 0.05, 16, 32);
      const wheelMaterial = new this.THREE.MeshStandardMaterial({ color: 0x333333 });

      const frontWheel = new this.THREE.Mesh(wheelGeometry, wheelMaterial);
      frontWheel.position.set(0, 0.3, -0.4);
      frontWheel.rotation.x = Math.PI / 2;
      bicycleGroup.add(frontWheel);

      const backWheel = new this.THREE.Mesh(wheelGeometry, wheelMaterial);
      backWheel.position.set(0, 0.3, 0.4);
      backWheel.rotation.x = Math.PI / 2;
      bicycleGroup.add(backWheel);

      // Handlebars
      const handlebarGeometry = new this.THREE.CylinderGeometry(0.05, 0.05, 0.4);
      const handlebarMaterial = new this.THREE.MeshStandardMaterial({ color: 0x555555 });
      const handlebar = new this.THREE.Mesh(handlebarGeometry, handlebarMaterial);
      handlebar.position.set(0, 0.6, -0.3);
      handlebar.rotation.z = Math.PI / 2;
      bicycleGroup.add(handlebar);

      // Cyclist
      const cyclistBodyGeometry = new this.THREE.CylinderGeometry(0.15, 0.15, 0.5, 8);
      const cyclistMaterial = new this.THREE.MeshStandardMaterial({ color: 0x22ABE2 }); // Light blue jersey
      const cyclistBody = new this.THREE.Mesh(cyclistBodyGeometry, cyclistMaterial);
      cyclistBody.position.set(0, 0.8, 0);
      cyclistBody.rotation.x = Math.PI / 2;
      bicycleGroup.add(cyclistBody);

      const cyclistHeadGeometry = new this.THREE.SphereGeometry(0.15, 16, 16);
      const helmetMaterial = new this.THREE.MeshStandardMaterial({ color: 0x333333 }); // Dark helmet
      const cyclistHead = new this.THREE.Mesh(cyclistHeadGeometry, helmetMaterial);
      cyclistHead.position.set(0, 1.1, -0.05);
      bicycleGroup.add(cyclistHead);

      // Position bicycle on the road
      bicycleGroup.position.set(this.getLanePosition(this.bicycleLane), 0, -5);
      this.scene.add(bicycleGroup);

      this.bicycle = bicycleGroup;
    },

    addScenery() {
      // Add some mountains in the background
      const mountainGeometry = new this.THREE.ConeGeometry(4, 8, 4);
      const mountainMaterial = new this.THREE.MeshStandardMaterial({
        color: 0x8B4513,
        roughness: 1
      });

      // Add multiple mountains
      for (let i = -20; i <= 20; i += 10) {
        const mountain = new this.THREE.Mesh(mountainGeometry, mountainMaterial);
        mountain.position.set(i, 0, -50);
        this.scene.add(mountain);

        // Add snow-capped peak
        const snowGeometry = new this.THREE.ConeGeometry(1.5, 2, 4);
        const snowMaterial = new this.THREE.MeshStandardMaterial({
          color: 0xFFFFFF,
          roughness: 0.5
        });
        const snow = new this.THREE.Mesh(snowGeometry, snowMaterial);
        snow.position.set(i, 7, -50);
        this.scene.add(snow);
      }

      // Add clouds
      const cloudGeometry = new this.THREE.SphereGeometry(2, 8, 8);
      const cloudMaterial = new this.THREE.MeshBasicMaterial({ color: 0xFFFFFF });

      for (let i = -30; i <= 30; i += 15) {
        for (let j = -60; j <= -20; j += 20) {
          const cloudGroup = new this.THREE.Group();

          const mainCloud = new this.THREE.Mesh(cloudGeometry, cloudMaterial);
          cloudGroup.add(mainCloud);

          // Add some smaller cloud puffs
          for (let k = 0; k < 3; k++) {
            const puff = new this.THREE.Mesh(
                new this.THREE.SphereGeometry(1 + Math.random(), 6, 6),
                cloudMaterial
            );
            puff.position.set(
                (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 1.5,
                (Math.random() - 0.5) * 3
            );
            cloudGroup.add(puff);
          }

          cloudGroup.position.set(i, 10 + Math.random() * 5, j);
          this.scene.add(cloudGroup);
        }
      }
    },

    createObstacle() {
      // Choose a random animal
      const animal = this.animals[Math.floor(Math.random() * this.animals.length)];

      // Create animal obstacle
      const animalGroup = new this.THREE.Group();

      // Body - using CylinderGeometry instead of CapsuleGeometry
      const bodyGeometry = new this.THREE.CylinderGeometry(
          animal.scale, animal.scale, animal.scale * 1.5, 8
      );
      const bodyMaterial = new this.THREE.MeshStandardMaterial({ color: animal.color });
      const body = new this.THREE.Mesh(bodyGeometry, bodyMaterial);
      body.rotation.x = Math.PI / 2;
      animalGroup.add(body);

      // Head
      const headGeometry = new this.THREE.SphereGeometry(animal.scale * 0.6, 8, 8);
      const head = new this.THREE.Mesh(headGeometry, bodyMaterial);
      head.position.set(0, 0, -animal.scale * 1.2);
      animalGroup.add(head);

      // Choose a random lane
      const lane = Math.floor(Math.random() * 3);

      animalGroup.position.set(
          this.getLanePosition(lane),
          animal.scale,
          -50 // Far down the road
      );

      this.scene.add(animalGroup);

      // Add to obstacles array with metadata
      this.obstacles.push({
        mesh: animalGroup,
        lane: lane,
        name: animal.name,
        collisionRadius: animal.scale * 1.2
      });
    },

    getLanePosition(lane) {
      return (lane - 1) * this.laneWidth;
    },

    updateObstacles(deltaTime) {
      // Make copies of arrays to avoid reactivity issues
      const obstacles = [...this.obstacles];

      // Move existing obstacles
      for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        obstacle.mesh.position.z += this.speed * deltaTime * 60;

        // Check if obstacle is past the player
        if (obstacle.mesh.position.z > 0) {
          // Remove obstacle
          this.scene.remove(obstacle.mesh);
          this.obstacles.splice(i, 1);
          i--;

          // Increase score
          this.score++;

          // Increase speed every 5 points
          if (this.score % 5 === 0 && this.score > 0) {
            this.speed += 0.02;
          }
        }

        // Check for collision with player
        if (!this.isGameOver && this.isColliding(this.bicycle, obstacle)) {
          this.handleGameOver();
        }
      }

      // Update road segments for scrolling effect
      for (let i = 0; i < this.roadSegments.length; i++) {
        const segment = this.roadSegments[i];
        segment.position.z += this.speed * deltaTime * 60;

        // If road segment is past the camera, move it to the back
        if (segment.position.z > this.roadLength / 2) {
          segment.position.z -= this.roadLength * this.roadSegments.length;
        }
      }

      // Spawn new obstacles
      this.obstacleSpawnTime += deltaTime;

      // Adjust spawn rate based on difficulty
      const spawnRate = Math.max(1.5 - this.score / 50, 0.7);

      if (this.obstacleSpawnTime > spawnRate) {
        this.createObstacle();
        this.obstacleSpawnTime = 0;
      }
    },

    isColliding(bicycle, obstacle) {
      // Simple distance-based collision detection
      const bicyclePos = bicycle.position;
      const obstaclePos = obstacle.mesh.position;

      const xDist = Math.abs(bicyclePos.x - obstaclePos.x);
      const zDist = Math.abs(bicyclePos.z - obstaclePos.z);

      // Calculate distance between centers
      const distance = Math.sqrt(xDist * xDist + zDist * zDist);

      // Define collision radius
      const bicycleRadius = 0.6;

      return distance < (bicycleRadius + obstacle.collisionRadius);
    },

    handleGameOver() {
      this.isGameOver = true;
      this.gameOver = true;

      // Update high score if needed
      if (this.score > this.highScore) {
        this.highScore = this.score;

        // Store high score in local storage if available
        try {
          localStorage.setItem('wildlifeDodgeHighScore', this.highScore.toString());
        } catch (e) {
          console.log('Could not save high score to localStorage');
        }
      }

      // Add a simple animation for game over
      const animateGameOver = () => {
        this.bicycle.rotation.z += 0.1;

        if (this.bicycle.rotation.z < Math.PI * 2) {
          requestAnimationFrame(animateGameOver);
        }
      };

      animateGameOver();
    },

    startGame() {
      // Reset game state
      this.obstacleSpawnTime = 0;
      this.score = 0;
      this.speed = 0.2;
      this.isGameOver = false;

      // Clear existing obstacles
      this.obstacles.forEach(obstacle => {
        this.scene.remove(obstacle.mesh);
      });
      this.obstacles = [];

      // Reset bicycle position
      if (this.bicycle) {
        this.bicycle.position.set(this.getLanePosition(1), 0, -5);
        this.bicycle.rotation.z = 0;
      }

      // Update state
      this.gameOver = false;
      this.gameStarted = true;
    },

    restartGame() {
      this.gameStarted = false;
      this.gameOver = false;
      setTimeout(() => {
        this.startGame();
      }, 100);
    },

    handleKeyDown(e) {
      if (this.isGameOver || !this.gameStarted) return;

      // Left arrow or A
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        if (this.bicycleLane > 0) {
          this.bicycleLane--;
          this.bicycle.position.x = this.getLanePosition(this.bicycleLane);
        }
      }
      // Right arrow or D
      else if (e.key === 'ArrowRight' || e.key === 'd') {
        if (this.bicycleLane < 2) {
          this.bicycleLane++;
          this.bicycle.position.x = this.getLanePosition(this.bicycleLane);
        }
      }
    },

    handleTouchStart(e) {
      if (this.isGameOver || !this.gameStarted) return;

      const touchX = e.touches[0].clientX;
      const screenWidth = this.$refs.mountRef.clientWidth;

      // Left side of screen
      if (touchX < screenWidth / 2) {
        if (this.bicycleLane > 0) {
          this.bicycleLane--;
          this.bicycle.position.x = this.getLanePosition(this.bicycleLane);
        }
      }
      // Right side of screen
      else {
        if (this.bicycleLane < 2) {
          this.bicycleLane++;
          this.bicycle.position.x = this.getLanePosition(this.bicycleLane);
        }
      }
    },

    handleResize() {
      if (!this.$refs.mountRef) return;

      const width = this.$refs.mountRef.clientWidth;
      const height = this.$refs.mountRef.clientHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(width, height);
    },

    animate() {
      if (!this.$refs.mountRef) return;

      const deltaTime = this.clock.getDelta();

      if (this.gameStarted && !this.isGameOver) {
        this.updateObstacles(deltaTime);

        // Animate bicycle wheels spinning
        if (this.bicycle) {
          // Use a traditional for loop instead of forEach to avoid proxy issues
          for (let i = 0; i < this.bicycle.children.length; i++) {
            const child = this.bicycle.children[i];
            if (child.geometry && child.geometry.type === 'TorusGeometry') {
              child.rotation.y += this.speed * 2;
            }
          }
        }

        // Update road segments for scrolling effect
        for (let i = 0; i < this.roadSegments.length; i++) {
          const segment = this.roadSegments[i];
          segment.position.z += this.speed * deltaTime * 60;

          // If road segment is past the camera, move it to the back
          if (segment.position.z > this.roadLength / 2) {
            segment.position.z -= this.roadLength * this.roadSegments.length;
          }
        }
      }

      this.renderer.render(this.scene, this.camera);
      this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    }
  }
};
</script>