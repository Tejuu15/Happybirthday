# Happy Birthday Keerthuuu 🎉

A beautiful, interactive birthday website with photo galleries and animations.

## Features

- 🎂 Interactive "Open Surprise" button with confetti animation
- 📸 Swipeable photo gallery with lightbox viewer
- 🎵 Optional background music controls
- 📱 Fully responsive design
- ✨ Smooth animations and parallax effects

## GitHub Pages Deployment

This repository is configured to automatically deploy to GitHub Pages using GitHub Actions.

### Setup Instructions

1. **Enable GitHub Pages in Repository Settings:**
   - Go to your repository settings
   - Navigate to "Pages" in the left sidebar
   - Under "Source", select "GitHub Actions"
   - The workflow will automatically deploy when you push to the `main` branch

2. **Manual Deployment:**
   - Go to the "Actions" tab in your repository
   - Click on "Deploy to GitHub Pages" workflow
   - Click "Run workflow" to manually trigger deployment

### Deployment Details

- **Trigger:** Automatic deployment on push to `main` branch
- **Content:** All static files (HTML, CSS, JS, images)
- **Build Process:** None required - pure static site
- **URL:** Will be available at `https://[username].github.io/Happybirthday`

## Local Development

To run locally:

```bash
# Navigate to project directory
cd Happybirthday

# Start a local server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

## File Structure

```
├── index.html          # Main HTML file
├── styles.css          # Stylesheet
├── app.js             # JavaScript functionality
├── photos/            # Image gallery
└── .github/
    └── workflows/
        └── deploy.yml # GitHub Pages deployment workflow
```

## Made with ❤️ for Keerthuuu

This special birthday website celebrates precious memories through an interactive photo gallery and delightful animations.