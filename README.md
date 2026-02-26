# Game Hub Calculator

A calculator application that doubles as a game hub launcher. Enter "1987" or press Shift+J to unlock the game hub.

## Features

- **Calculator**: Fully functional scientific calculator
- **Game Hub**: Launch games from GitHub repos and external sites
- **Privacy**: Games open in about:blank tabs for privacy
- **Auto-sync**: Automatically fetches games from your GitHub repositories

## Setup

1. Update the GitHub username in `script.js` (line 194)
2. Add your games to the `externalGames` array
3. Deploy to GitHub Pages

## Deployment

This project uses GitHub Actions for automatic deployment to GitHub Pages.

## Usage

- Use the calculator normally
- Enter "1987" or press Shift+J to unlock the game hub
- Press backtick (`) for panic redirect to Desmos

## Configuration

### GitHub Repositories
Any repository with GitHub Pages enabled will automatically appear in the game hub.

### External Games
Add external games in the `externalGames` array in `script.js`:

```javascript
const externalGames = [
  { name: "Game Name", url: "https://example.com/game", image: "https://example.com/icon.png" },
];
```

### Custom Images
Add custom game icons in the `gameImages` object:

```javascript
const gameImages = {
  "repo-name": "https://example.com/image.png",
};
```

### Iframe Games
Force games to open in iframes with the `iframeGames` object:

```javascript
const iframeGames = {
  "repo-name": true, // or custom URL
};
```
