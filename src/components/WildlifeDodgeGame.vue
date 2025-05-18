<template>
  <div class="bg-white shadow-lg rounded-lg p-4 md:p-6 mb-4 md:mb-8">
    <!-- Game header -->
    <h2 class="text-xl font-semibold text-[#005eb8] mb-3 md:mb-4 flex items-center">
      <i class="fas fa-gamepad mr-2 md:mr-3 text-[#F49131]"></i>
      Wildlife Dodge Challenge
    </h2>

    <!-- Game description -->
    <p class="text-gray-600 mb-4">
      Help your virtual cyclist navigate the trail while dodging the wildlife
      I've encountered on my morning rides! Based on real wildlife encounters from my Everest Challenge.
    </p>

    <!-- Game canvas container -->
    <div id="game-container" class="relative w-full max-w-4xl mx-auto">
      <!-- Canvas element for the game -->
      <canvas
          ref="gameCanvas"
          width="800"
          height="400"
          class="bg-gradient-to-b from-[#87CEEB] to-[#8FD678] rounded-lg shadow-md w-full"
      ></canvas>

      <!-- Stats display -->
      <div class="flex flex-wrap justify-between mt-3 p-3 bg-gray-50 rounded-lg text-sm sm:text-base">
        <div>Distance: <span id="distance" class="font-bold text-[#005eb8]">0</span> m</div>
        <div>Elevation: <span id="elevation" class="font-bold text-[#005eb8]">0</span> ft</div>
        <div>Wildlife Dodged: <span id="score" class="font-bold text-[#005eb8]">0</span></div>
      </div>

      <!-- Game over screen (initially hidden) -->
      <div
          ref="gameOver"
          class="hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
               bg-[#005eb8]/90 text-white p-5 rounded-lg text-center z-10"
      >
        <h2 class="text-xl font-bold mb-2">Game Over!</h2>
        <p class="mb-3">You got bumped by wildlife!</p>
        <div>Final Distance: <span ref="finalDistance" class="font-bold">0</span> m</div>
        <div>Elevation Gained: <span ref="finalElevation" class="font-bold">0</span> ft</div>
        <div class="mb-2">Wildlife Encountered:</div>
        <div ref="animalCount" class="flex flex-wrap gap-2 justify-center mb-4"></div>
        <button
            ref="restartButton"
            class="bg-[#F49131] text-white border-none py-2 px-5 rounded-lg cursor-pointer font-bold hover:bg-[#E3822B] transition"
        >
          Ride Again
        </button>
      </div>

      <!-- Start screen (initially visible) -->
      <div
          ref="startScreen"
          class="absolute top-0 left-0 w-full h-full bg-[#005eb8]/90 text-white
               flex flex-col justify-center items-center text-center rounded-lg z-10"
      >
        <h1 class="text-2xl font-bold mb-2 text-[#FFC72C] drop-shadow-md">Wildlife Dodge Challenge</h1>
        <p class="mb-2">Help the cyclist navigate the trail and dodge wildlife!</p>
        <p class="mb-4 text-sm">Based on real wildlife encounters from the Everest Challenge</p>
        <button
            ref="startButton"
            class="bg-[#F49131] text-white border-none py-2 px-5 rounded-lg cursor-pointer font-bold hover:bg-[#E3822B] transition"
        >
          Start Riding
        </button>
        <div class="mt-4 text-sm">
          <div>
            <span class="bg-white/20 px-2 py-1 rounded-md inline-block m-1">A</span> and
            <span class="bg-white/20 px-2 py-1 rounded-md inline-block m-1">D</span> to move
          </div>
          <div>
            <span class="bg-white/20 px-2 py-1 rounded-md inline-block m-1">W</span> to jump
          </div>
          <div class="text-xs mt-2">On mobile: Tap to jump, swipe to move</div>
        </div>
      </div>
    </div>

    <!-- Game footer -->
    <div class="mt-4 text-sm text-gray-500 italic text-center">
      Pro tip: Try to beat my current record of 1,132 meters without crashing!
    </div>
  </div>
</template>

<script>
export default {
  name: 'WildlifeDodgeGame',

  data() {
    return {
      // Game state variables
      gameRunning: false,
      distance: 0,
      elevation: 0,
      score: 0,
      gameSpeed: 5,
      lastFrameTime: 0,
      animationFrameId: null,

      // Core elements
      canvas: null,
      ctx: null,
      groundY: 0,

      // Player properties
      player: {
        x: 100,
        y: 0,
        width: 50,
        height: 50,
        jumping: false,
        jumpForce: 15,
        velocity: 0,
        gravity: 0.8,
        moveSpeed: 7,
        isMovingLeft: false,
        isMovingRight: false,
        image: null
      },

      // Game elements
      obstacles: [],
      mountains: [],
      wildlifeImages: {},
      animalEncounters: {
        'deer': 0,
        'rabbit': 0,
        'pheasant': 0,
        'squirrel': 0,
        'sheep': 0
      }
    }
  },

  // Lifecycle hooks
  mounted() {
    // Initialize game on component mount
    this.initGame();

    // Set up window event listeners
    window.addEventListener('resize', this.resizeCanvas);

    // Cleanup will be handled in unmounted
  },

// Add unmounted hook for Vue 3 cleanup
  unmounted() {
    // Clean up event listeners
    window.removeEventListener('resize', this.resizeCanvas);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  },

  methods: {
    // INITIALIZATION METHODS

    // Initialize game
    initGame() {
      // Get canvas and context
      this.canvas = this.$refs.gameCanvas;
      this.ctx = this.canvas.getContext('2d');
      this.groundY = this.canvas.height - 60;

      // Load images
      this.loadImages();

      // Create background elements
      this.createMountains();

      // Set up player position
      this.player.y = this.groundY - this.player.height;

      // Add event listeners
      this.$refs.startButton.addEventListener('click', this.startGame);
      this.$refs.restartButton.addEventListener('click', this.restartGame);
      window.addEventListener('keydown', this.handleKeyDown);
      window.addEventListener('keyup', this.handleKeyUp);

      // Touch controls for mobile
      this.setupTouchControls();

      // Size canvas properly
      this.resizeCanvas();
    },

    // Load game images
    loadImages() {
      // Player (cyclist) image - more reliable way to create SVG images
      this.player.image = new Image();
      this.player.image.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="none" width="100" height="100"/><circle fill="%2322ABE2" cx="30" cy="30" r="15"/><circle fill="%23005eb8" cx="60" cy="70" r="20"/><circle fill="%23005eb8" cx="30" cy="70" r="20"/><rect fill="%23F49131" x="30" y="30" width="30" height="5"/><rect fill="%23F49131" x="40" y="35" width="5" height="20"/></svg>`;

      // Wildlife images - using simpler SVG approach without Base64
      const animals = ['deer', 'rabbit', 'pheasant', 'squirrel', 'sheep'];
      animals.forEach(animal => {
        this.wildlifeImages[animal] = new Image();
      });

      // Simple colored shapes instead of complex SVGs to prevent loading errors
      this.wildlifeImages.deer.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><rect fill="none" width="60" height="60"/><ellipse fill="%23A5754A" cx="30" cy="40" rx="20" ry="15"/><circle fill="%23A5754A" cx="15" cy="30" r="5"/><circle fill="%23A5754A" cx="45" cy="30" r="5"/></svg>`;
      this.wildlifeImages.rabbit.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect fill="none" width="40" height="40"/><ellipse fill="%23E0E0E0" cx="20" cy="25" rx="12" ry="10"/><circle fill="%23E0E0E0" cx="20" cy="15" r="8"/></svg>`;
      this.wildlifeImages.pheasant.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"><rect fill="none" width="50" height="50"/><ellipse fill="%23B76722" cx="25" cy="30" rx="20" ry="10"/><circle fill="%23904B11" cx="40" cy="20" r="7"/></svg>`;
      this.wildlifeImages.squirrel.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect fill="none" width="40" height="40"/><ellipse fill="%239E6B4A" cx="20" cy="25" rx="10" ry="12"/><circle fill="%239E6B4A" cx="20" cy="13" r="8"/></svg>`;
      this.wildlifeImages.sheep.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><rect fill="none" width="60" height="60"/><ellipse fill="%23F1F1F1" cx="30" cy="35" rx="25" ry="18"/><circle fill="%23E5E5E5" cx="30" cy="25" r="7"/></svg>`;
    },

    // Create background mountains
    createMountains() {
      const numMountains = 6;
      this.mountains = [];

      for (let i = 0; i < numMountains; i++) {
        this.mountains.push({
          x: (i * (this.canvas.width/numMountains)) + Math.random() * 50 - 25,
          y: this.groundY,
          width: 150 + Math.random() * 100,
          height: 80 + Math.random() * 100,
          color: `rgb(${90 + Math.random() * 40}, ${110 + Math.random() * 50}, ${90 + Math.random() * 40})`
        });
      }
    },

    // Set up touch controls
    setupTouchControls() {
      let touchStartX = 0;

      this.canvas.addEventListener('touchstart', (e) => {
        if (!this.gameRunning) {
          this.startGame();
          return;
        }

        const touch = e.touches[0];
        touchStartX = touch.clientX;

        // Jump on tap if on the ground
        if (!this.player.jumping && this.player.y >= this.groundY - this.player.height) {
          this.player.jumping = true;
          this.player.velocity = -this.player.jumpForce;
        }
      }, { passive: true });

      this.canvas.addEventListener('touchmove', (e) => {
        if (!this.gameRunning) return;

        const touch = e.touches[0];
        const diffX = touch.clientX - touchStartX;

        if (diffX > 20) {
          this.player.isMovingLeft = false;
          this.player.isMovingRight = true;
        } else if (diffX < -20) {
          this.player.isMovingLeft = true;
          this.player.isMovingRight = false;
        }
      }, { passive: true });

      this.canvas.addEventListener('touchend', () => {
        this.player.isMovingLeft = false;
        this.player.isMovingRight = false;
      }, { passive: true });
    },

    // INPUT HANDLING METHODS

    // Handle key down events
    handleKeyDown(e) {
      // If game is not running, W can start the game
      if (!this.gameRunning && e.code === 'KeyW') {
        this.startGame();
        return;
      }

      // Handle controls during gameplay
      switch (e.code) {
        case 'KeyA':
          this.player.isMovingLeft = true;
          break;
        case 'KeyD':
          this.player.isMovingRight = true;
          break;
        case 'KeyW':
          // Jump only if on the ground
          if (!this.player.jumping && this.player.y >= this.groundY - this.player.height) {
            this.player.jumping = true;
            this.player.velocity = -this.player.jumpForce;
          }
          break;
      }
    },

// Updated keyboard release handling
    handleKeyUp(e) {
      switch (e.code) {
        case 'KeyA':
          this.player.isMovingLeft = false;
          break;
        case 'KeyD':
          this.player.isMovingRight = false;
          break;
      }
    },

    // Handle canvas resizing
    resizeCanvas() {
      const container = document.getElementById('game-container');
      if (!container) return;

      const containerWidth = container.clientWidth;

      // Only resize if container is smaller than canvas
      if (containerWidth < this.canvas.width) {
        const ratio = this.canvas.height / this.canvas.width;
        this.canvas.width = containerWidth;
        this.canvas.height = this.canvas.width * ratio;

        // Adjust ground position
        this.groundY = this.canvas.height - 60;

        // Update player position
        this.player.y = this.groundY - this.player.height;
      }
    },

    // GAME CONTROL METHODS

    // Start new game
    startGame() {
      // Hide start screen
      this.$refs.startScreen.style.display = 'none';

      // Reset game state
      this.gameRunning = true;
      this.distance = 0;
      this.elevation = 0;
      this.score = 0;
      this.gameSpeed = 5;
      this.obstacles = [];
      this.animalEncounters = {
        'deer': 0,
        'rabbit': 0,
        'pheasant': 0,
        'squirrel': 0,
        'sheep': 0
      };

      // Update display
      this.updateStats();

      // Start the game loop
      this.lastFrameTime = performance.now();
      this.animationFrameId = requestAnimationFrame(this.gameLoop);
    },

    // Restart after game over
    restartGame() {
      // Hide game over screen
      this.$refs.gameOver.style.display = 'none';

      // Start a fresh game
      this.startGame();
    },

    // GAME LOOP METHODS

    // Main game loop
    gameLoop(timestamp) {
      // Calculate time since last frame
      const deltaTime = timestamp - this.lastFrameTime;
      this.lastFrameTime = timestamp;

      // Game logic
      this.clearCanvas();
      this.updateGame(deltaTime);
      this.drawGame();

      // Continue loop if game is still running
      if (this.gameRunning) {
        this.animationFrameId = requestAnimationFrame(this.gameLoop);
      }
    },

    // Clear canvas between frames
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    // Update game state
    updateGame(deltaTime) {
      // Update distance and elevation
      this.distance += this.gameSpeed * 0.1;
      this.elevation += Math.random() * 0.5;

      // Gradually increase game speed
      if (this.distance % 100 < 0.1) {
        this.gameSpeed += 0.1;
      }

      // Update player
      this.updatePlayer();

      // Update obstacles
      this.updateObstacles();

      // Generate new obstacles
      if (Math.random() < 0.01 + (this.gameSpeed * 0.001)) {
        this.generateObstacle();
      }

      // Check collisions
      this.checkCollisions();

      // Update stats display
      this.updateStats();
    },

    // Update player position
    updatePlayer() {
      // Handle jumping
      if (this.player.jumping) {
        this.player.velocity += this.player.gravity;
        this.player.y += this.player.velocity;

        // Check if landed
        if (this.player.y >= this.groundY - this.player.height) {
          this.player.y = this.groundY - this.player.height;
          this.player.jumping = false;
          this.player.velocity = 0;
        }
      }

      // Handle horizontal movement
      if (this.player.isMovingLeft) {
        this.player.x -= this.player.moveSpeed;
      }
      if (this.player.isMovingRight) {
        this.player.x += this.player.moveSpeed;
      }

      // Keep player within bounds
      if (this.player.x < 0) {
        this.player.x = 0;
      }
      if (this.player.x > this.canvas.width - this.player.width) {
        this.player.x = this.canvas.width - this.player.width;
      }
    },

    // Update obstacles
    updateObstacles() {
      for (let i = this.obstacles.length - 1; i >= 0; i--) {
        this.obstacles[i].x -= this.gameSpeed;

        // Remove obstacles that are off-screen
        if (this.obstacles[i].x + this.obstacles[i].width < 0) {
          // Increment score when successfully passed an obstacle
          this.score++;
          this.obstacles.splice(i, 1);
        }
      }
    },

    // Generate new wildlife obstacles
    generateObstacle() {
      const types = ['deer', 'rabbit', 'pheasant', 'squirrel', 'sheep'];
      const type = types[Math.floor(Math.random() * types.length)];

      let width, height;
      switch (type) {
        case 'deer':
          width = 60;
          height = 60;
          break;
        case 'sheep':
          width = 60;
          height = 60;
          break;
        case 'pheasant':
          width = 50;
          height = 50;
          break;
        default:
          width = 40;
          height = 40;
      }

      // Flying pheasants have a chance to be higher up
      let y = this.groundY - height;
      if (type === 'pheasant' && Math.random() < 0.5) {
        y -= Math.random() * 100;
      }

      this.obstacles.push({
        x: this.canvas.width,
        y: y,
        width: width,
        height: height,
        type: type
      });

      // Count this new animal encounter
      this.animalEncounters[type]++;
    },

    // Check for collisions
    checkCollisions() {
      for (const obstacle of this.obstacles) {
        // Use slightly smaller hitbox (80% of actual size) for better gameplay feel
        if (
            this.player.x < obstacle.x + obstacle.width * 0.8 &&
            this.player.x + this.player.width * 0.8 > obstacle.x &&
            this.player.y < obstacle.y + obstacle.height * 0.8 &&
            this.player.y + this.player.height * 0.8 > obstacle.y
        ) {
          this.endGame();
          break;
        }
      }
    },

    // RENDERING METHODS

    // Draw game elements
    drawGame() {
      // Draw sky gradient
      const skyGradient = this.ctx.createLinearGradient(0, 0, 0, this.groundY);
      skyGradient.addColorStop(0, '#87CEEB'); // Sky blue
      skyGradient.addColorStop(1, '#C1E6FF'); // Lighter blue at horizon
      this.ctx.fillStyle = skyGradient;
      this.ctx.fillRect(0, 0, this.canvas.width, this.groundY);

      // Draw mountains in the background
      this.drawMountains();

      // Draw ground
      const groundGradient = this.ctx.createLinearGradient(0, this.groundY, 0, this.canvas.height);
      groundGradient.addColorStop(0, '#8FD678'); // Light green at top
      groundGradient.addColorStop(1, '#3A6E22'); // Darker green at bottom
      this.ctx.fillStyle = groundGradient;
      this.ctx.fillRect(0, this.groundY, this.canvas.width, this.canvas.height - this.groundY);

      // Draw path
      this.ctx.fillStyle = '#B8873A';
      this.ctx.fillRect(0, this.groundY - 5, this.canvas.width, 10);

      // Draw player
      this.ctx.drawImage(
          this.player.image,
          this.player.x,
          this.player.y,
          this.player.width,
          this.player.height
      );

      // Draw obstacles
      for (const obstacle of this.obstacles) {
        this.ctx.drawImage(
            this.wildlifeImages[obstacle.type],
            obstacle.x,
            obstacle.y,
            obstacle.width,
            obstacle.height
        );
      }
    },

// Draw mountains background
    drawMountains() {
      for (const mountain of this.mountains) {
        // Move the mountain with parallax effect (slower than obstacles)
        mountain.x -= this.gameSpeed * 0.2;

        // Reset the mountain's position when it moves off-screen
        if (mountain.x + mountain.width < 0) {
          mountain.x = this.canvas.width;
        }

        // Draw the mountain as a simple triangle
        this.ctx.fillStyle = mountain.color;
        this.ctx.beginPath();
        this.ctx.moveTo(mountain.x, mountain.y);
        this.ctx.lineTo(mountain.x + mountain.width/2, mountain.y - mountain.height);
        this.ctx.lineTo(mountain.x + mountain.width, mountain.y);
        this.ctx.closePath();
        this.ctx.fill();

        // Draw snow cap on top
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.moveTo(mountain.x + mountain.width * 0.35, mountain.y - mountain.height * 0.7);
        this.ctx.lineTo(mountain.x + mountain.width/2, mountain.y - mountain.height);
        this.ctx.lineTo(mountain.x + mountain.width * 0.65, mountain.y - mountain.height * 0.7);
        this.ctx.closePath();
        this.ctx.fill();
      }
    },

    // UI METHODS

    // Update stats display
    updateStats() {
      // Update DOM elements with current values
      document.getElementById('distance').textContent = Math.floor(this.distance);
      document.getElementById('elevation').textContent = Math.floor(this.elevation);
      document.getElementById('score').textContent = this.score;
    },

// Handle game over
    endGame() {
      // Stop game loop
      this.gameRunning = false;

      // Update final stats
      const finalDistanceEl = this.$refs.finalDistance;
      const finalElevationEl = this.$refs.finalElevation;

      if (finalDistanceEl && finalElevationEl) {
        finalDistanceEl.textContent = Math.floor(this.distance);
        finalElevationEl.textContent = Math.floor(this.elevation);
      }

      // Show animal encounters in game over screen
      const animalCountDiv = this.$refs.animalCount;
      if (animalCountDiv) {
        animalCountDiv.innerHTML = '';

        for (const animal in this.animalEncounters) {
          if (this.animalEncounters[animal] > 0) {
            const badge = document.createElement('div');
            badge.className = 'bg-white/30 px-2 py-1 rounded-full flex items-center gap-1';
            badge.innerHTML = `${animal}: ${this.animalEncounters[animal]}`;
            animalCountDiv.appendChild(badge);
          }
        }
      }

      // Display game over screen
      if (this.$refs.gameOver) {
        this.$refs.gameOver.style.display = 'block';
      }
    }
  }
}
</script>