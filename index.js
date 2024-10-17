
const images = [
  "resources/background1.jpg",
  "resources/background2.jpg",
  "resources/background3.jpg",
  "resources/background4.jpg",
  "resources/background5.jpg"
];


const scrollContainer = document.getElementById('scrollContainer');

//load the images
function loadImages() {
  images.forEach(imageSrc => {
    const imgElement = document.createElement('img');
    imgElement.src = imageSrc; 
    imgElement.alt = "MTG background images"; 
    scrollContainer.appendChild(imgElement);
  });
}

loadImages(); 


const nextButton = document.querySelector('.next');
const prevButton = document.querySelector('.prev');
let index = 0;
const totalImages = images.length;

function moveSlider(direction) {
  
  index += direction;

  if (index >= totalImages) {
    index = totalImages - 1;
  } else if (index < 0) {
    index = 0;
  }

  const imageWidth = scrollContainer.querySelector('img').clientWidth;
 
  const offset = imageWidth * index;
  scrollContainer.scrollTo({
    left: offset,
    behavior: 'smooth' 
  });
}
nextButton.addEventListener('click', () => moveSlider(1));
prevButton.addEventListener('click', () => moveSlider(-1));