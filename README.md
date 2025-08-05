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
   - It creates `config.js` with your API key during deployment
   - The API key is never exposed in your repository

### Option 2: Demo Mode

If you don't set up the API key, the site will run in demo mode on GitHub Pages:
- Chips will still work and respond
- Users will see demo responses instead of AI-generated content
- Perfect for showcasing the interface without API costs

### Local Development

For local development, always use the config.js file:
```bash
cp config.example.js config.js
# Edit config.js with your API key
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
├── css/                    # Stylesheets
├── js/                     # JavaScript files
├── config.js              # Configuration with API key (git-ignored)
├── config.example.js      # Configuration template
└── assets/                # Image assets
```