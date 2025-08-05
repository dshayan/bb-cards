// Chat functionality and API integration

// Google Gemini API Configuration (loaded from config.js)
const GEMINI_API_KEY = CONFIG.GEMINI_API_KEY;
const GEMINI_API_URL = CONFIG.GEMINI_API_URL;

// Conversation history for maintaining context
let conversationHistory = [];

// Persian system prompts loaded from config
const systemPrompts = CONFIG.SYSTEM_PROMPTS;

// Function to get API key from config
function getApiKey() {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
        console.error('API key not configured. Please update config.js with your Gemini API key.');
        return null;
    }
    return GEMINI_API_KEY;
}

// Function to call Gemini API
async function callGeminiAPI(message, systemPrompt) {
    const apiKey = getApiKey();
    if (!apiKey) {
        throw new Error('API key not configured');
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
    botMessage.className = 'self-start max-w-[80%] rounded-2xl p-2 bg-gray-100 text-gray-800 shadow-sm';
    botMessage.innerHTML = `
        <div class="text-xs leading-relaxed font-vazir text-right">
            <p>${messageText}</p>
        </div>
    `;
    
    // Add the message to the chat container
    chatContainer.appendChild(botMessage);
    
    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Function to show typing indicator
function showTypingIndicator() {
    const chatContainer = document.querySelector('.chat-bubble-container');
    
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'self-start max-w-[80%] rounded-2xl p-2 bg-gray-100 text-gray-800 shadow-sm typing-indicator';
    typingIndicator.innerHTML = `
        <div class="text-xs leading-relaxed font-vazir text-right">
            <p>در حال تایپ...</p>
        </div>
    `;
    
    chatContainer.appendChild(typingIndicator);
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
    userMessage.className = 'self-end max-w-[60%] rounded-3xl p-2 bg-blue-50 text-blue-900 shadow-sm';
    userMessage.innerHTML = `
        <div class="text-xs leading-relaxed font-vazir text-right">
            <p>${messageText}</p>
        </div>
    `;
    
    // Add the message to the chat container
    chatContainer.appendChild(userMessage);
    
    // Scroll to bottom (if needed)
    chatContainer.scrollTop = chatContainer.scrollHeight;
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
    const generalPrompt = CONFIG.SYSTEM_PROMPTS.general;
    
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
            
            // Hide the buttons after clicking
            this.parentElement.style.display = 'none';
        });
    });
    
    // Add event listener for chat input
    const chatInput = document.getElementById('chatInput');
    const inputField = chatInput.querySelector('input');
    const sendButton = chatInput.querySelector('button');
    
    // Handle send button click
    sendButton.addEventListener('click', function() {
        const messageText = inputField.value.trim();
        if (messageText) {
            handleChatInput(messageText);
            inputField.value = '';
        }
    });
    
    // Handle Enter key press
    inputField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const messageText = inputField.value.trim();
            if (messageText) {
                handleChatInput(messageText);
                inputField.value = '';
            }
        }
    });
}

// Initialize chat when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeChat();
});