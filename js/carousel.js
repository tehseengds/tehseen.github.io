// Load screenshots from JSON file
async function loadScreenshots() {
    try {
        const response = await fetch('/js/screenshots.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading screenshots:', error);
        return {};
    }
}

// Create carousel for a project
function createCarousel(projectId, screenshots) {
    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'carousel-container relative mt-6 bg-gray-50 rounded-xl p-4';
    
    // Create phone frame
    const phoneFrame = document.createElement('div');
    phoneFrame.className = 'phone-frame mx-auto w-64 h-[500px] bg-black rounded-[40px] p-2 shadow-xl';
    
    // Create screen
    const screen = document.createElement('div');
    screen.className = 'screen w-full h-full bg-white rounded-[32px] overflow-hidden relative';
    
    // Create image container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container w-full h-full relative';
    
    // Add images
    screenshots.forEach((screenshot, index) => {
        const img = document.createElement('img');
        img.src = screenshot;
        img.alt = `Screenshot ${index + 1}`;
        img.className = `absolute w-full h-full object-cover transition-opacity duration-300 ${index === 0 ? 'opacity-100' : 'opacity-0'}`;
        img.dataset.index = index;
        imageContainer.appendChild(img);
    });
    
    screen.appendChild(imageContainer);
    phoneFrame.appendChild(screen);
    carouselContainer.appendChild(phoneFrame);
    
    // Add navigation buttons
    const navContainer = document.createElement('div');
    navContainer.className = 'flex justify-center items-center mt-4 space-x-4';
    
    const prevButton = document.createElement('button');
    prevButton.className = 'p-2 rounded-full bg-primary text-white hover:bg-secondary transition-colors';
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    
    const nextButton = document.createElement('button');
    nextButton.className = 'p-2 rounded-full bg-primary text-white hover:bg-secondary transition-colors';
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    
    // Add dot indicators
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'flex space-x-2';
    screenshots.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = `w-2 h-2 rounded-full transition-colors ${index === 0 ? 'bg-primary' : 'bg-gray-300'}`;
        dot.dataset.index = index;
        dotsContainer.appendChild(dot);
    });
    
    navContainer.appendChild(prevButton);
    navContainer.appendChild(dotsContainer);
    navContainer.appendChild(nextButton);
    carouselContainer.appendChild(navContainer);
    
    // Add carousel functionality
    let currentIndex = 0;
    const images = imageContainer.querySelectorAll('img');
    const dots = dotsContainer.querySelectorAll('button');
    
    function updateCarousel(index) {
        images.forEach(img => img.classList.remove('opacity-100'));
        dots.forEach(dot => dot.classList.remove('bg-primary'));
        
        images[index].classList.add('opacity-100');
        dots[index].classList.add('bg-primary');
        currentIndex = index;
    }
    
    prevButton.addEventListener('click', () => {
        const newIndex = (currentIndex - 1 + images.length) % images.length;
        updateCarousel(newIndex);
    });
    
    nextButton.addEventListener('click', () => {
        const newIndex = (currentIndex + 1) % images.length;
        updateCarousel(newIndex);
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => updateCarousel(index));
    });
    
    // Add touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    imageContainer.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    imageContainer.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left
            const newIndex = (currentIndex + 1) % images.length;
            updateCarousel(newIndex);
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right
            const newIndex = (currentIndex - 1 + images.length) % images.length;
            updateCarousel(newIndex);
        }
    }
    
    return carouselContainer;
}

// Initialize carousels for all projects
async function initializeCarousels() {
    const screenshots = await loadScreenshots();
    
    // Add carousels to each project card
    Object.entries(screenshots).forEach(([projectId, projectScreenshots]) => {
        const projectCard = document.querySelector(`[data-project-id="${projectId}"]`);
        if (projectCard) {
            const carousel = createCarousel(projectId, projectScreenshots);
            projectCard.appendChild(carousel);
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCarousels); 