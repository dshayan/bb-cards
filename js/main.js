// Main JavaScript - Initialization and tab switching logic

let currentCard = 'gold';

// Tab switching functionality
function switchTab(cardType) {
    // Hide all card containers
    document.querySelectorAll('.card-container').forEach(content => {
        content.classList.add('hidden');
    });
    
    // Remove active class from all tabs and reset to gray
    document.querySelectorAll('.tab-button').forEach(tab => {
        tab.classList.remove('active');
        tab.classList.remove('text-yellow-600', 'text-gray-400', 'text-orange-600');
        tab.classList.add('text-gray-600');
    });
    
    // Show selected card content
    document.getElementById(cardType + 'Card').classList.remove('hidden');
    
    // Add active class and color to selected tab
    const activeTab = document.getElementById(cardType + 'Tab');
    activeTab.classList.remove('text-gray-600');
    activeTab.classList.add('active');
    
    if (cardType === 'gold') {
        activeTab.classList.add('text-yellow-600');
    } else if (cardType === 'silver') {
        activeTab.classList.add('text-gray-400');
    } else if (cardType === 'bronze') {
        activeTab.classList.add('text-orange-600');
    }
    
    currentCard = cardType;
}

// Initialize tab event listeners
function initializeTabs() {
    document.getElementById('goldTab').addEventListener('click', () => switchTab('gold'));
    document.getElementById('silverTab').addEventListener('click', () => switchTab('silver'));
    document.getElementById('bronzeTab').addEventListener('click', () => switchTab('bronze'));
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
});