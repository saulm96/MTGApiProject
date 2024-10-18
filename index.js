const images = [
  "resources/background1.jpg",
  "resources/background2.jpg",
  "resources/background3.jpg",
  "resources/background4.jpg",
  "resources/background5.jpg"
];

const scrollContainer = document.getElementById('scrollContainer');
let currentImageIndex = 0;
let currentImage = null;
let containerInitialized = false;
let isTransitioning = false;
let autoSlideInterval;

// Add necessary styles to container
scrollContainer.style.position = 'relative';

// Create dots container
const dotsContainer = document.createElement('div');
dotsContainer.className = 'dots-container';
scrollContainer.parentNode.appendChild(dotsContainer);

// Create indicator dots
images.forEach((_, index) => {
  const dot = document.createElement('div');
  dot.className = 'dot';
  dot.addEventListener('click', () => {
      if (!isTransitioning && index !== currentImageIndex) {
          // Reset interval on click
          clearInterval(autoSlideInterval);
          loadImage(index);
          startAutoSlide();
      }
  });
  dotsContainer.appendChild(dot);
});

// Function to update dots indicators
function updateDots() {
  const dots = dotsContainer.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
      if (index === currentImageIndex) {
          dot.classList.add('active');
      } else {
          dot.classList.remove('active');
      }
  });
}

function loadImage(index) {
  if (isTransitioning) return;
  isTransitioning = true;
  currentImageIndex = index;

  const imgElement = document.createElement('img');
  imgElement.src = images[index];
  imgElement.alt = "MTG background images";
  
  imgElement.style.opacity = '0';
  imgElement.style.transition = 'opacity 1s ease-in-out';

  if (!containerInitialized) {
      imgElement.onload = function() {

          containerInitialized = true;
          imgElement.style.opacity = '1';
          currentImage = imgElement;
          isTransitioning = false;
          updateDots();
      };
      scrollContainer.appendChild(imgElement);
  } else {
      scrollContainer.appendChild(imgElement);
      
      // Wait a bit to ensure the image is rendered
      setTimeout(() => {
          // Start fade in of new image
          imgElement.style.opacity = '1';
          
          if (currentImage) {
              // Start fade out of current image
              currentImage.style.opacity = '0';

              scrollContainer.removeChild(currentImage);
              currentImage = imgElement;
              isTransitioning = false;
              updateDots();
          }
      }, 50);
  }
}

// Function to automatically move the slider
function autoMoveSlider() {
  if (!isTransitioning) {
      const nextIndex = (currentImageIndex + 1) % images.length;
      loadImage(nextIndex);
  }
}

// Function to start automatic sliding
function startAutoSlide() {
  autoSlideInterval = setInterval(autoMoveSlider, 5000);
}

// Load first image
loadImage(currentImageIndex);

// Start automatic sliding
startAutoSlide();