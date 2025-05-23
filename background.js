class CloudBackground {
    constructor(canvasId, options = {}) {
      this.config = {
        cloudCount: 5,
        minSpeed: 0.05,
        maxSpeed: 0.2,
        minScale: 0.3,
        maxScale: 0.5,
        opacity: 0.25,
        cloudImages: [
          'Images/cloud1.png',
          'Images/cloud2.png',
          'Images/cloud3.png',
          'Images/cloud4.png',
          'Images/cloud5.png',
          'Images/cloud6.png'
        ],
        gradientColors: ['#56CCF2', '#2F80ED'],
        ...options
      };
  
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) {
        console.error(`Canvas element with id '${canvasId}' not found`);
        return;
      }
  
      this.ctx = this.canvas.getContext('2d');
      this.clouds = [];
      this.cloudImages = [];
      this.animationId = null;
  
      this.init();
    }
  
    async init() {
      await this.loadImages();
      this.resizeCanvas();
      this.createClouds();
      this.setupEventListeners();
      this.startAnimation();
    }
  
    async loadImages() {
        console.log("Starting to load images...");
        const loadPromises = this.config.cloudImages.map(src => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = src;
                img.onload = () => {
                    console.log(`Successfully loaded: ${src}`);
                    this.cloudImages.push(img);
                    resolve();
                };
                img.onerror = () => {
                    console.error(`Failed to load: ${src}`);
                    resolve();
                };
            });
        });
    
        await Promise.all(loadPromises);
        console.log(`Total loaded images: ${this.cloudImages.length}`);}
  
    resizeCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.drawBackground();
    }
  
    drawBackground() {
      const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
      gradient.addColorStop(0, this.config.gradientColors[0]);
      gradient.addColorStop(1, this.config.gradientColors[1]);
      
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  
    createClouds() {
      for (let i = 0; i < this.config.cloudCount; i++) {
        this.clouds.push(this.createCloud());
      }
    }
  
    createCloud() {
      const cloud = {
        image: this.cloudImages[Math.floor(Math.random() * this.cloudImages.length)],
        scale: this.config.minScale + Math.random() * (this.config.maxScale - this.config.minScale),
        speed: this.config.minSpeed + Math.random() * (this.config.maxSpeed - this.config.minSpeed),
        x: 0,
        y: 0
      };
  
      this.resetCloudPosition(cloud);
      return cloud;
    }
  
    resetCloudPosition(cloud) {
      cloud.x = Math.random() * this.canvas.width;
      cloud.y = Math.random() * this.canvas.height * 0.7;
      
      if (Math.random() > 0.5) {
        cloud.x = -200;
      } else {
        cloud.x = this.canvas.width + 200;
        cloud.speed *= -1;
      }
    }
  
    updateClouds() {
      this.clouds.forEach(cloud => {
        cloud.x += cloud.speed;
        
        if ((cloud.speed > 0 && cloud.x > this.canvas.width + 200) || 
            (cloud.speed < 0 && cloud.x < -200)) {
          this.resetCloudPosition(cloud);
        }
      });
    }
  
    drawClouds() {
      this.clouds.forEach(cloud => {
        if (!cloud.image.complete) return;
        
        const width = cloud.image.width * cloud.scale;
        const height = cloud.image.height * cloud.scale;
        
        this.ctx.save();
        this.ctx.globalAlpha = this.config.opacity;
        this.ctx.drawImage(
          cloud.image, 
          cloud.x - width/2, 
          cloud.y - height/2, 
          width, 
          height
        );
        this.ctx.restore();
      });
    }
  
    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawBackground();
      this.updateClouds();
      this.drawClouds();
      this.animationId = requestAnimationFrame(() => this.animate());
    }
  
    startAnimation() {
      if (!this.animationId) {
        this.animate();
      }
    }
  
    stopAnimation() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    }
  
    setupEventListeners() {
      window.addEventListener('resize', () => {
        this.resizeCanvas();
      });
    }
  
    setCloudCount(count) {
      this.config.cloudCount = count;
      this.clouds = [];
      this.createClouds();
    }
  
    setSpeed(min, max) {
      this.config.minSpeed = min;
      this.config.maxSpeed = max;
      this.clouds.forEach(cloud => {
        cloud.speed = min + Math.random() * (max - min);
      });
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    window.cloudBackground = new CloudBackground('pixie', {
      cloudImages: [
        'Images/cloud1.png',
          'Images/cloud2.png',
          'Images/cloud3.png',
          'Images/cloud4.png',
          'Images/cloud5.png',
          'Images/cloud6.png'
      ],
      gradientColors: ['#56CCF2', '#2F80ED'],
    });
  });