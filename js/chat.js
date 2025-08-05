// Chat functionality and API integration

// Check if CONFIG is available (loaded from config.js)
const configAvailable = typeof CONFIG !== 'undefined';
console.log('Chat.js loading - CONFIG available:', configAvailable);
if (configAvailable) {
    console.log('CONFIG object:', CONFIG);
}

// Google Gemini API Configuration (loaded from config.js)
const GEMINI_API_KEY = configAvailable ? CONFIG.GEMINI_API_KEY : null;
const GEMINI_API_URL = configAvailable ? CONFIG.GEMINI_API_URL : 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Conversation history for maintaining context
let conversationHistory = [];

// Persian system prompts loaded from config (with minimal fallback)
const systemPrompts = configAvailable ? CONFIG.SYSTEM_PROMPTS : {
    'blame': 'مشاور بیمه خودرو',
    'damage': 'مشاور بیمه خودرو', 
    'deduction': 'مشاور بیمه خودرو',
    'general': 'مشاور بیمه خودرو'
};

// Function to get API key from config
function getApiKey() {
    if (!configAvailable) {
        console.warn('Configuration not available. Running in demo mode.');
        return null;
    }
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
        console.error('API key not configured. Please update config.js with your Gemini API key.');
        return null;
    }
    return GEMINI_API_KEY;
}

// Simple demo responses for when API is not available
const demoResponses = {
    'blame': 'لطفاً جزئیات تصادف را شرح دهید.',
    'damage': 'لطفاً نوع خسارت را توضیح دهید.',
    'deduction': 'لطفاً نوع بیمه‌نامه خود را مشخص کنید.',
    'general': 'چطور می‌تونم کمکتون کنم؟'
};

// Function to get demo response
function getDemoResponse(actionType) {
    return demoResponses[actionType] || demoResponses.general;
}

// Function to call Gemini API
async function callGeminiAPI(message, systemPrompt) {
    const apiKey = getApiKey();
    if (!apiKey) {
        // Return demo response when no API key is available
        return 'این یک نسخه نمایشی است. برای استفاده کامل از مشاورهٔ هوشمند، لطفاً API key را تنظیم کنید.';
    }
    
    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: systemPrompt }]
                    },
                    ...conversationHistory,
                    {
                        role: 'user',
                        parts: [{ text: message }]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                },
                safetySettings: [
                    {
                        category: 'HARM_CATEGORY_HARASSMENT',
                        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                    },
                    {
                        category: 'HARM_CATEGORY_HATE_SPEECH',
                        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                    },
                    {
                        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                    },
                    {
                        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            
            // Add to conversation history
            conversationHistory.push(
                { role: 'user', parts: [{ text: message }] },
                { role: 'model', parts: [{ text: aiResponse }] }
            );
            
            // Keep conversation history manageable (last 10 exchanges)
            if (conversationHistory.length > 20) {
                conversationHistory = conversationHistory.slice(-20);
            }
            
            return aiResponse;
        } else {
            throw new Error('Invalid response format from Gemini API');
        }
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return 'متأسفم، در حال حاضر نمی‌توانم به سوال شما پاسخ دهم. لطفاً دوباره تلاش کنید.';
    }
}

// Function to add bot message to chat
function addBotMessage(messageText) {
    const chatContainer = document.querySelector('.chat-bubble-container');
    
    // Create bot message element
    const botMessage = document.createElement('div');
    botMessage.className = 'self-end max-w-[80%] rounded-2xl p-2 chat-message-bot shadow-sm message-animate';
    botMessage.innerHTML = `
        <div class="text-xs leading-relaxed font-vazir text-right">
            <p>${messageText}</p>
        </div>
    `;
    
    // Set initial state for animation
    botMessage.style.opacity = '0';
    
    // Add the message to the chat container
    chatContainer.appendChild(botMessage);
    
    // Trigger animation after a brief delay
    requestAnimationFrame(() => {
        botMessage.style.opacity = '1';
    });
    
    // Scroll to bottom
    setTimeout(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 100);
}

// Function to show typing indicator
function showTypingIndicator() {
    const chatContainer = document.querySelector('.chat-bubble-container');
    
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'self-end max-w-[80%] rounded-2xl p-2 chat-message-bot shadow-sm typing-indicator typing-animate';
    typingIndicator.innerHTML = `
        <div class="text-xs leading-relaxed font-vazir text-right">
            <p>...</p>
        </div>
    `;
    
    // Set initial state for animation
    typingIndicator.style.opacity = '0';
    
    chatContainer.appendChild(typingIndicator);
    
    // Trigger animation
    requestAnimationFrame(() => {
        typingIndicator.style.opacity = '1';
    });
    
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    return typingIndicator;
}

// Function to remove typing indicator
function removeTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Function to add user message to chat
function addUserMessage(messageText) {
    const chatContainer = document.querySelector('.chat-bubble-container');
    
    // Create user message element
    const userMessage = document.createElement('div');
    userMessage.className = 'self-start max-w-[60%] rounded-3xl p-2 chat-message-user shadow-sm message-animate';
    userMessage.innerHTML = `
        <div class="text-xs leading-relaxed font-vazir text-right">
            <p>${messageText}</p>
        </div>
    `;
    
    // Set initial state for animation
    userMessage.style.opacity = '0';
    
    // Add the message to the chat container
    chatContainer.appendChild(userMessage);
    
    // Trigger animation
    requestAnimationFrame(() => {
        userMessage.style.opacity = '1';
    });
    
    // Scroll to bottom (if needed)
    setTimeout(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 100);
}

// Function to handle AI response for action buttons
async function handleActionButtonClick(actionType, messageText) {
    // Add user message
    addUserMessage(messageText);
    
    // Show typing indicator
    const typingIndicator = showTypingIndicator();
    
    // Get system prompt based on action
    const systemPrompt = systemPrompts[actionType];
    
    try {
        // Call Gemini API
        const aiResponse = await callGeminiAPI(messageText, systemPrompt);
        
        // Remove typing indicator
        removeTypingIndicator();
        
        // Add AI response
        addBotMessage(aiResponse);
        
    } catch (error) {
        // Remove typing indicator
        removeTypingIndicator();
        
        // Add error message
        addBotMessage('متأسفم، خطایی رخ داده است. لطفاً دوباره تلاش کنید.');
    }
    
    // Show the compose bar after user selects an action
    const chatInput = document.getElementById('chatInput');
    chatInput.classList.remove('hidden');
    
    // Enable the input field
    const inputField = chatInput.querySelector('input');
    inputField.removeAttribute('readonly');
}

// Function to handle chat input messages
async function handleChatInput(messageText) {
    if (!messageText.trim()) return;
    
    // Add user message
    addUserMessage(messageText);
    
    // Show typing indicator
    const typingIndicator = showTypingIndicator();
    
    // Use the general consultation prompt from config for follow-up messages
    const generalPrompt = configAvailable ? CONFIG.SYSTEM_PROMPTS.general : systemPrompts.general;
    
    try {
        // Call Gemini API
        const aiResponse = await callGeminiAPI(messageText, generalPrompt);
        
        // Remove typing indicator
        removeTypingIndicator();
        
        // Add AI response
        addBotMessage(aiResponse);
        
    } catch (error) {
        console.error('Error in chat input:', error);
        
        // Remove typing indicator
        removeTypingIndicator();
        
        // Add error message
        addBotMessage('متأسفم، خطایی رخ داده است. لطفاً دوباره تلاش کنید.');
    }
}

// Initialize chat functionality
function initializeChat() {
    // Set initial scroll position for chip bar to the right (for RTL)
    const chipContainer = document.querySelector('.chip-container');
    if (chipContainer) {
        chipContainer.scrollLeft = chipContainer.scrollWidth;
    }
    
    // Add event listeners to chat option buttons
    document.querySelectorAll('.chat-option-button').forEach(button => {
        button.addEventListener('click', function() {
            const messageText = this.textContent.trim();
            let actionType;
            
            // Determine action type based on button text
            if (messageText.includes('مقصر')) {
                actionType = 'blame';
            } else if (messageText.includes('خسارت')) {
                actionType = 'damage';
            } else if (messageText.includes('کسورات')) {
                actionType = 'deduction';
            }
            
            // Handle the action
            handleActionButtonClick(actionType, messageText);
            
            // Hide the chip bar and show the chat input after clicking
            const chipBar = document.getElementById('chipBar');
            chipBar.style.display = 'none';
        });
    });
    
    // Add event listener for chat input
    const chatInput = document.getElementById('chatInput');
    const inputField = chatInput.querySelector('input');
    const sendButton = chatInput.querySelector('button');
    
    // Function to update send button state
    function updateSendButtonState() {
        const messageText = inputField.value.trim();
        if (messageText) {
            sendButton.disabled = false;
            sendButton.classList.remove('btn-disabled');
            sendButton.classList.add('btn-primary');
        } else {
            sendButton.disabled = true;
            sendButton.classList.add('btn-disabled');
            sendButton.classList.remove('btn-primary');
        }
    }
    
    // Monitor input changes
    inputField.addEventListener('input', updateSendButtonState);
    inputField.addEventListener('keyup', updateSendButtonState);
    inputField.addEventListener('paste', function() {
        setTimeout(updateSendButtonState, 10);
    });
    
    // Handle send button click
    sendButton.addEventListener('click', function() {
        const messageText = inputField.value.trim();
        if (messageText && !sendButton.disabled) {
            handleChatInput(messageText);
            inputField.value = '';
            updateSendButtonState();
        }
    });
    
    // Handle Enter key press
    inputField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const messageText = inputField.value.trim();
            if (messageText && !sendButton.disabled) {
                handleChatInput(messageText);
                inputField.value = '';
                updateSendButtonState();
            }
        }
    });
    
    // Initialize button state
    updateSendButtonState();
}

// Initialize chat when DOM is ready and config is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for config.js to load if it exists
    setTimeout(() => {
        console.log('CONFIG available:', typeof CONFIG !== 'undefined');
        if (typeof CONFIG !== 'undefined') {
            console.log('API Key configured:', !!CONFIG.GEMINI_API_KEY);
        }
        initializeChat();
    }, 100);
});