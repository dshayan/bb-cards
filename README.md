# BB Cards

A Persian insurance card comparison website with integrated Google Gemini AI consultation for insurance-related queries.

## Setup

1. Get your Google Gemini API key from [Google AI Studio](https://aistudio.google.com/)
2. Configure the API key:

   ```bash
   cp config/api.example.js config/api.js
   ```
   Then edit `config/api.js` and replace `your_gemini_api_key_here` with your actual API key.

## Configuration

The application uses Google Gemini 2.0 Flash model with specialized Persian system prompts for insurance consultation. 

### Configuration Files:
- **`config/prompts.js`**: Contains AI system prompts (version controlled)
- **`config/api.js`**: Contains API key and URL (git-ignored for security)
- **`config.js`**: Generated automatically during deployment

## Deployment to GitHub Pages

To deploy to GitHub Pages while keeping your API key secure:

### Option 1: Automated Deployment with GitHub Actions (Recommended)

1. **Set up GitHub Secret:**
   - Go to your repository on GitHub
   - Navigate to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `GEMINI_API_KEY`
   - Value: Your actual Gemini API key
   - Click "Add secret"

2. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `gh-pages`
   - Click "Save"

3. **Deploy:**
   - The GitHub Action will automatically run when you push to main
   - It creates `config.js` by combining `config/prompts.js` with your secret API key
   - The API key is never exposed in your repository

### Option 2: Demo Mode

If you don't set up the API key, the site will run in demo mode on GitHub Pages:
- Chips will still work and respond
- Users will see demo responses instead of AI-generated content
- Perfect for showcasing the interface without API costs

### Local Development

For local development, create your API configuration:
```bash
cp config/api.example.js config/api.js
# Edit config/api.js and add your API key
# The prompts are already in config/prompts.js
```

## Usage

Open `index.html` in your web browser. The application provides:

- **Insurance Card Comparison**: Compare Gold, Silver, and Bronze insurance cards
- **AI Consultation**: Get expert advice on fault determination, damage estimation, and insurance deductions
- **Persian Interface**: Fully localized interface and AI responses

## Directory Structure

```
bb-cards/
├── index.html              # Main HTML file
├── src/                    # Source code
│   ├── css/               # Stylesheets
│   └── js/                # JavaScript files
├── config/                 # Configuration files
│   ├── prompts.js         # AI system prompts (version controlled)
│   ├── api.example.js     # API configuration template
│   └── api.js             # API configuration (git-ignored)
├── config.js               # Generated config (git-ignored)
└── assets/                 # Image assets
```