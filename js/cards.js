// Card flip animations and interactions

// Show back card functionality (flip animation)
function initializeCardFlips() {
    document.querySelectorAll('.show-back-card').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const flipContainer = document.getElementById(targetId);
            
            // Add flipped class to trigger flip animation
            flipContainer.classList.add('flipped');
        });
    });
    
    // Close back card functionality (flip back)
    document.querySelectorAll('.close-back-card').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const flipContainer = document.getElementById(targetId);
            
            // Remove flipped class to flip back to front
            flipContainer.classList.remove('flipped');
        });
    });
}

// Initialize card functionality when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeCardFlips();
});