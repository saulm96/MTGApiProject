
class CarouselImageSlider {
    constructor(containerSelector, imagesData, dotPositionSelector) {
      this.scrollContainer = document.querySelector(containerSelector);
      this.images = imagesData;
      this.dotsPosition = document.querySelector(dotPositionSelector);

      this.currentImageIndex = 0;
      this.currentImage = null;
      this.containerInitialized = false;
      this.isTransitioning = false;
      this.autoSlideInterval;

      //Add classList to the container to add styles later.
      this.scrollContainer.classList.add('scroll-container');
  
      // Create dots container
      this.dotsContainer = document.createElement('div');
      this.dotsContainer.className = 'dots-container';
      this.dotsPosition.appendChild(this.dotsContainer);
  
      // Create indicator dots for each image
      this.images.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        //Adding event listeners to switch image on dot click
        dot.addEventListener('click', () => {
          if (!this.isTransitioning && index !== this.currentImageIndex) {
            clearInterval(this.autoSlideInterval);
            this.loadImage(index);
            this.startAutoSlide();
          }
        });
        this.dotsContainer.appendChild(dot);
      });
      //Initialize dots and load the first image
      this.updateDots();
      this.loadImage(this.currentImageIndex);
      this.startAutoSlide();
    }
  
    loadImage(index) {
      if (this.isTransitioning) return;

      this.isTransitioning = true;
      this.currentImageIndex = index;
  
      //Create new image element for selected image
      const imgElement = document.createElement('img');
      imgElement.src = this.images[index];
      imgElement.alt = "MTG background images";
      imgElement.className = 'carousel-image';
  
      // Preload image before displaying
      const preloadImage = new Image();
      preloadImage.src = this.images[index];
      preloadImage.onload = () => {
        if (!this.containerInitialized) {
          //On first load, append the image and fade it in
          this.scrollContainer.appendChild(imgElement);
          setTimeout(() => {
            imgElement.style.opacity = '1';
            this.currentImage = imgElement;
            this.containerInitialized = true;
            this.isTransitioning = false;
            this.updateDots();
          }, 50);
        } else {
          //On subsequent loads, fade out the old image and replace it
          this.scrollContainer.appendChild(imgElement);
          setTimeout(() => {
            imgElement.style.opacity = '1';
            if (this.currentImage) {
              this.currentImage.style.opacity = '0';
              setTimeout(() => {
                this.scrollContainer.removeChild(this.currentImage);
                this.currentImage = imgElement;
                this.isTransitioning = false;
                this.updateDots();
              }, 100);
            }
          }, 50);
        }
      };
    }
  
    updateDots() {
      //Update the active state of the indicator dots based on the current image
      const dots = this.dotsContainer.querySelectorAll('.dot');
      dots.forEach((dot, index) => {
        if (index === this.currentImageIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
  
    autoMoveSlider() {
      if (!this.isTransitioning) {
        //Automatically move to the next image after a delay
        const nextIndex = (this.currentImageIndex + 1) % this.images.length;
        this.loadImage(nextIndex);
      }
    }
  
    startAutoSlide() {
      //Start the automatic image transition at a set interval
      this.autoSlideInterval = setInterval(this.autoMoveSlider.bind(this), 5000);
    }
  }
  
  const imageData = [
    "resources/background1.jpg",
    "resources/background2.jpg",
    "resources/background3.jpg",
    "resources/background4.jpg",
    "resources/background5.jpg",
    "resources/background6.jpg"
  ];
  
  //Initialize the carousel in this same document.
  const carousel = new CarouselImageSlider('#scrollContainer', imageData, '.dot-position');