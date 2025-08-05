// API configuration file
// Add your actual Gemini API key here
// This file should be kept private and not committed to the repository

const API_CONFIG = {
    GEMINI_API_KEY: 'your_gemini_api_key_here',
    GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_CONFIG };
}