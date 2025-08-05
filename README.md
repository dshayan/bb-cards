# BB Cards

A Persian insurance card comparison website with integrated Google Gemini AI consultation for insurance-related queries.

## Setup

1. Get your Google Gemini API key from [Google AI Studio](https://aistudio.google.com/)
2. Configure the API key:

   ```bash
   cp config.example.js config.js
   ```
   Then edit `config.js` and replace `your_gemini_api_key_here` with your actual API key.

## Configuration

The application uses Google Gemini 2.0 Flash model with specialized Persian system prompts for insurance consultation. The `config.js` file contains your API key and is automatically excluded from git commits for security.

## Usage

Open `index.html` in your web browser. The application provides:

- **Insurance Card Comparison**: Compare Gold, Silver, and Bronze insurance cards
- **AI Consultation**: Get expert advice on fault determination, damage estimation, and insurance deductions
- **Persian Interface**: Fully localized interface and AI responses

## Directory Structure

```
bb-cards/
├── index.html              # Main HTML file
├── css/                    # Stylesheets
├── js/                     # JavaScript files
├── config.js              # Configuration with API key (git-ignored)
├── config.example.js      # Configuration template
└── assets/                # Image assets
```