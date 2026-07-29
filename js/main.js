document.addEventListener('DOMContentLoaded', () => {
    // Utility function to handle dynamic image fallbacks globally
    window.handleImageError = function(imgElement) {
        imgElement.onerror = null; 
        imgElement.src = 'images/placeholder-product.png';
    };
});
